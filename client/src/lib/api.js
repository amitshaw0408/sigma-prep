const BASE = ((import.meta.env && import.meta.env.VITE_API_URL) || '') + '/api'
const KEY = 'sp_token'

// Admin login token lives in sessionStorage (cleared when the tab closes).
export const token = {
  get: () => { try { return sessionStorage.getItem(KEY) } catch { return null } },
  set: (t) => { try { sessionStorage.setItem(KEY, t) } catch { /* ignore */ } },
  clear: () => { try { sessionStorage.removeItem(KEY) } catch { /* ignore */ } },
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {}, t = token.get()
  if (t) headers.Authorization = 'Bearer ' + t
  let payload
  if (form) payload = form
  else if (body) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body) }
  const res = await fetch(BASE + path, { method, headers, body: payload })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && t) token.clear()
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export const courseForm = (c, file) => {
  const f = new FormData()
  f.append('data', JSON.stringify(c))
  if (file) f.append('image', file)
  return f
}
