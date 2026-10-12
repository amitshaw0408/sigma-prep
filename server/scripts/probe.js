// Usage (from the server folder):  node scripts/probe.js
// Sends a deliberately incomplete upload request and prints the raw answer, to see who is saying "403".
import 'dotenv/config'

const cloud = process.env.CLOUDINARY_CLOUD_NAME
const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`
const fd = new FormData()
fd.append('file', 'data:image/png;base64,iVBORw0KGgo=')

try {
  const res = await fetch(url, { method: 'POST', body: fd })
  const text = await res.text()
  console.log('URL:         ', url)
  console.log('Status:      ', res.status)
  console.log('Content-Type:', res.headers.get('content-type'))
  console.log('Server:      ', res.headers.get('server'))
  console.log('Body (first 400 chars):\n' + text.slice(0, 400))
} catch (e) {
  console.log('Request failed before getting an answer:', e.cause?.code || e.message)
}