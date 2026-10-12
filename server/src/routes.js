import { Router } from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import { CourseModel as Course, ReviewModel as Review, FolderModel as Folder } from './models.js'
import { uploadImage, removeImage } from './cloudinary.js'
import { login, requireAdmin } from './auth.js'

const r = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, f, cb) => { const ok = /^image\/(jpeg|png|webp|gif)$/.test(f.mimetype); cb(ok ? null : new Error('Only JPG, PNG, WebP or GIF images are allowed.'), ok) },
})

// --- small helpers: every field is whitelisted, trimmed and length-limited ---
const str = (v, max = 300) => String(v ?? '').trim().slice(0, max)
const list = (v, max = 40, len = 200) => (Array.isArray(v) ? v : []).map((x) => str(x, len)).filter(Boolean).slice(0, max)
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
const bad = (res, m) => res.status(400).json({ error: m })
const validId = (req, res, next) => (mongoose.isValidObjectId(req.params.id) ? next() : bad(res, 'Invalid id.'))
const body = (req) => { try { return JSON.parse(req.body.data || '{}') } catch { return {} } }
const courseFields = (b) => ({
  title: str(b.title, 120), cat: str(b.cat, 60), level: str(b.level, 60) || 'All levels', topics: list(b.topics), desc: str(b.desc, 1000),
  learn: list(b.learn), prereq: str(b.prereq, 300), modules: list(b.modules), skills: list(b.skills), format: str(b.format, 200), price: str(b.price, 40),
})
const reviewFields = (b) => ({ name: str(b.name, 80), text: str(b.text, 800), course: str(b.course, 120) })

// --- auth ---
r.post('/admin/login', h(login))

// --- public reads ---
r.get('/courses', h(async (_q, res) => res.json(await Course.find().sort('createdAt'))))
r.get('/reviews', h(async (_q, res) => res.json(await Review.find().sort('createdAt'))))
r.get('/folders', h(async (_q, res) => res.json(Object.fromEntries((await Folder.find()).map((f) => [f.cat, f.img])))))

// --- admin: courses (multipart: JSON in "data" + optional "image" file) ---
r.post('/courses', requireAdmin, upload.single('image'), h(async (req, res) => {
  const f = courseFields(body(req))
  if (!f.title || !f.cat || !f.desc) return bad(res, 'Title, category and description are required.')
  const c = new Course(f)
  if (req.file) { const u = await uploadImage(req.file.buffer, 'courses'); c.img = u.url; c.imgId = u.id }
  await c.save()
  res.status(201).json(c)
}))

r.put('/courses/:id', requireAdmin, validId, upload.single('image'), h(async (req, res) => {
  const c = await Course.findById(req.params.id)
  if (!c) return res.status(404).json({ error: 'Course not found.' })
  const f = courseFields(body(req))
  if (!f.title || !f.cat || !f.desc) return bad(res, 'Title, category and description are required.')
  Object.assign(c, f)
  const oldImg = c.imgId
  if (req.file) { const u = await uploadImage(req.file.buffer, 'courses'); c.img = u.url; c.imgId = u.id }
  await c.save()
  if (req.file) await removeImage(oldImg)
  res.json(c)
}))

r.delete('/courses/:id', requireAdmin, validId, h(async (req, res) => {
  const c = await Course.findByIdAndDelete(req.params.id)
  if (c) await removeImage(c.imgId)
  res.json({ ok: true })
}))

// --- admin: reviews ---
r.post('/reviews', requireAdmin, h(async (req, res) => {
  const f = reviewFields(req.body)
  if (!f.name || !f.text) return bad(res, 'Name and review text are required.')
  res.status(201).json(await Review.create(f))
}))

r.put('/reviews/:id', requireAdmin, validId, h(async (req, res) => {
  const f = reviewFields(req.body)
  if (!f.name || !f.text) return bad(res, 'Name and review text are required.')
  const rev = await Review.findByIdAndUpdate(req.params.id, { ...f, sample: false }, { new: true })
  rev ? res.json(rev) : res.status(404).json({ error: 'Review not found.' })
}))

r.delete('/reviews/:id', requireAdmin, validId, h(async (req, res) => { await Review.findByIdAndDelete(req.params.id); res.json({ ok: true }) }))

// --- admin: folders. A folder is a category name; it can exist before it has any courses, and can have a cover image. ---
r.post('/folders', requireAdmin, h(async (req, res) => {
  const cat = str(req.body.cat, 60)
  if (!cat) return bad(res, 'Folder name is required.')
  await Folder.updateOne({ cat }, { $setOnInsert: { cat } }, { upsert: true })
  res.status(201).json({ cat })
}))

// Rename a folder: every course in it moves to the new name and the cover image goes with it.
r.put('/folders/rename', requireAdmin, h(async (req, res) => {
  const from = str(req.body.from, 60), to = str(req.body.to, 60)
  if (!from || !to) return bad(res, 'Old and new folder names are required.')
  await Course.updateMany({ cat: from }, { cat: to })
  const f = await Folder.findOne({ cat: from })
  if (f) {
    if (await Folder.exists({ cat: to })) { await Folder.deleteOne({ _id: f._id }); await removeImage(f.imgId) } // merging: keep the existing folder's cover
    else { f.cat = to; await f.save() }
  }
  res.json({ ok: true })
}))

// Set / replace a folder cover image (creates the folder record if needed).
r.put('/folders', requireAdmin, upload.single('image'), h(async (req, res) => {
  const cat = str(req.body.cat, 60)
  if (!cat || !req.file) return bad(res, 'Folder and image are required.')
  const u = await uploadImage(req.file.buffer, 'folders')
  const old = await Folder.findOneAndUpdate({ cat }, { img: u.url, imgId: u.id }, { upsert: true, new: false })
  if (old) await removeImage(old.imgId)
  res.json({ cat, img: u.url })
}))

// Remove only the cover image (the folder stays).
r.delete('/folders', requireAdmin, h(async (req, res) => {
  const f = await Folder.findOneAndUpdate({ cat: str(req.query.cat, 60) }, { img: '', imgId: '' }, { new: false })
  if (f) await removeImage(f.imgId)
  res.json({ ok: true })
}))

// Delete a folder (only when it has no courses).
r.delete('/folders/remove', requireAdmin, h(async (req, res) => {
  const cat = str(req.query.cat, 60)
  if (await Course.exists({ cat })) return bad(res, 'This folder still has courses. Move or delete them first.')
  const f = await Folder.findOneAndDelete({ cat })
  if (f) await removeImage(f.imgId)
  res.json({ ok: true })
}))

export default r
