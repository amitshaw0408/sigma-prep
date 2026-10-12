// Usage (from the server folder):  node scripts/test-upload.js
// Uploads a tiny test image several different ways and reports which ones Cloudinary accepts.
import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true })
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8//8/AwAFAAGl9kVAAAAAAElFTkSuQmCC'
const BUF = Buffer.from(PNG.split(',')[1], 'base64')

const viaStream = (opts) => new Promise((resolve, reject) => {
  const s = cloudinary.uploader.upload_stream(opts, (e, r) => (e ? reject(e) : resolve(r)))
  s.end(BUF)
})

const tests = [
  ['1 plain upload (data URI)', () => cloudinary.uploader.upload(PNG)],
  ['2 plain upload_stream (what the server uses)', () => viaStream({})],
  ['3 stream + folder', () => viaStream({ folder: 'sigma-prep/test' })],
  ['4 stream + resize', () => viaStream({ transformation: [{ width: 1000, crop: 'limit' }] })],
  ['5 stream + folder + resize + quality/format auto (exact server settings)', () => viaStream({ folder: 'sigma-prep/test', resource_type: 'image', transformation: [{ width: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }] })],
]

for (const [name, run] of tests) {
  try {
    const r = await run()
    console.log('OK   ', name)
    await cloudinary.uploader.destroy(r.public_id)
  } catch (e) {
    console.log('FAIL ', name, '->', e.http_code || '', e.message)
  }
}