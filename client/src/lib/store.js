import { useEffect, useState } from 'react'
import { api, courseForm, token } from './api'

// Loads courses, reviews and folder images from the API and exposes admin actions.
export function useStore() {
  const [d, setD] = useState({ courses: [], reviews: [], fimg: {} })
  const [status, setStatus] = useState('loading'), [authed, setAuthed] = useState(!!token.get())

  useEffect(() => {
    let live = true
    Promise.all([api('/courses'), api('/reviews'), api('/folders')])
      .then(([courses, reviews, fimg]) => { if (live) { setD({ courses, reviews, fimg }); setStatus('ready') } })
      .catch(() => live && setStatus('error'))
    return () => { live = false }
  }, [])

  const upsert = (k, x) => setD((p) => ({ ...p, [k]: p[k].some((y) => y.id === x.id) ? p[k].map((y) => (y.id === x.id ? x : y)) : [...p[k], x] }))
  const remove = (k, id) => setD((p) => ({ ...p, [k]: p[k].filter((y) => y.id !== id) }))
  const call = async (...a) => { try { return await api(...a) } catch (e) { if (!token.get()) setAuthed(false); throw e } }

  // Folders = categories used by courses + folders created on their own (they may be empty).
  const folders = [...new Set([...d.courses.map((c) => c.cat), ...Object.keys(d.fimg)])]

  return {
    ...d, folders, status, authed,
    login: async (id, password) => { const r = await api('/admin/login', { method: 'POST', body: { id, password } }); token.set(r.token); setAuthed(true) },
    logout: () => { token.clear(); setAuthed(false) },
    saveCourse: async (c, file) => upsert('courses', await call(c.id ? `/courses/${c.id}` : '/courses', { method: c.id ? 'PUT' : 'POST', form: courseForm(c, file) })),
    delCourse: async (id) => { await call(`/courses/${id}`, { method: 'DELETE' }); remove('courses', id) },
    saveReview: async (r) => upsert('reviews', await call(r.id ? `/reviews/${r.id}` : '/reviews', { method: r.id ? 'PUT' : 'POST', body: r })),
    delReview: async (id) => { await call(`/reviews/${id}`, { method: 'DELETE' }); remove('reviews', id) },
    setFolderImg: async (cat, file) => {
      const f = new FormData(); f.append('cat', cat); f.append('image', file)
      const r = await call('/folders', { method: 'PUT', form: f })
      setD((p) => ({ ...p, fimg: { ...p.fimg, [cat]: r.img } }))
    },
    removeFolderImg: async (cat) => {
      await call('/folders?cat=' + encodeURIComponent(cat), { method: 'DELETE' })
      setD((p) => ({ ...p, fimg: { ...p.fimg, [cat]: '' } }))
    },
    addFolder: async (cat) => {
      await call('/folders', { method: 'POST', body: { cat } })
      setD((p) => ({ ...p, fimg: { ...p.fimg, [cat]: p.fimg[cat] || '' } }))
    },
    renameFolder: async (from, to) => {
      await call('/folders/rename', { method: 'PUT', body: { from, to } })
      setD((p) => {
        const fimg = { ...p.fimg }
        if (from in fimg) { fimg[to] = fimg[to] || fimg[from]; delete fimg[from] }
        return { ...p, courses: p.courses.map((c) => (c.cat === from ? { ...c, cat: to } : c)), fimg }
      })
    },
    deleteFolder: async (cat) => {
      await call('/folders/remove?cat=' + encodeURIComponent(cat), { method: 'DELETE' })
      setD((p) => { const fimg = { ...p.fimg }; delete fimg[cat]; return { ...p, fimg } })
    },
  }
}
