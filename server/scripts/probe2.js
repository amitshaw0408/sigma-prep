// Usage (from the server folder):  node scripts/probe2.js
// Sends a correctly SIGNED upload by hand (no Cloudinary SDK) and prints the raw answer, including Cloudinary's error header.
import 'dotenv/config'
import crypto from 'node:crypto'

const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env
const timestamp = Math.floor(Date.now() / 1000)
const signature = crypto.createHash('sha1').update(`timestamp=${timestamp}${secret}`).digest('hex')

const fd = new FormData()
fd.append('file', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
fd.append('api_key', key)
fd.append('timestamp', String(timestamp))
fd.append('signature', signature)

try {
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: fd })
  const text = await res.text()
  console.log('Status:        ', res.status)
  console.log('x-cld-error:   ', res.headers.get('x-cld-error'))
  console.log('Content-Type:  ', res.headers.get('content-type'))
  console.log('Server:        ', res.headers.get('server'))
  console.log('Body (first 400 chars):\n' + text.slice(0, 400))
  if (res.status === 200) console.log('\nUpload worked without the SDK. (A tiny test image was added to your Cloudinary library; you can delete it.)')
} catch (e) {
  console.log('Request failed before getting an answer:', e.cause?.code || e.message)
}