import mongoose from 'mongoose'

// Clients receive `id` (string) instead of `_id`, and never see the Cloudinary public id (imgId).
const opts = {
  timestamps: true,
  toJSON: { virtuals: false, versionKey: false, transform: (_, r) => { r.id = String(r._id); delete r._id; delete r.imgId; return r } },
}
const S = (extra = {}) => ({ type: String, default: '', trim: true, ...extra })

const Course = new mongoose.Schema({
  title: S({ required: true }), cat: S({ required: true, index: true }), level: S({ default: 'All levels' }),
  topics: [String], desc: S({ required: true }), learn: [String], prereq: S(), modules: [String], skills: [String],
  format: S(), price: S(), img: S(), imgId: S(),
}, opts)

const Review = new mongoose.Schema({
  name: S({ required: true }), text: S({ required: true }), course: S(), sample: { type: Boolean, default: false },
}, opts)

const Folder = new mongoose.Schema({ cat: S({ required: true, unique: true }), img: S(), imgId: S() }, opts)

export const CourseModel = mongoose.model('Course', Course)
export const ReviewModel = mongoose.model('Review', Review)
export const FolderModel = mongoose.model('Folder', Folder)
