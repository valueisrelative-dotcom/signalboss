import { createHmac } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'

function getCookie(req, name) {
  const cookie = req.headers.cookie || ''
  const match = cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function verifySession(token, secret, ip) {
  try {
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return false
    const expected = createHmac('sha256', secret).update(payload).digest('hex')
    if (expected !== sig) return false
    const data = JSON.parse(Buffer.from(payload, 'base64').toString())
    if (Date.now() > data.exp) return false
    if (data.ip !== ip) return false
    return true
  } catch {
    return false
  }
}

function serveFile(res, relativePath) {
  const html = readFileSync(join(process.cwd(), relativePath), 'utf8')
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).send(html)
}

export default function handler(req, res) {
  const path = req.url?.split('?')[0] || '/'

  // Always serve these pages without auth
  if (path === '/fidelis-gate.html' || path.startsWith('/fidelis-admin')) {
    return serveFile(res, `public${path}`)
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.headers['x-real-ip'] || 'unknown'
  const cookie = getCookie(req, 'fidelis_session')

  if (!cookie || !verifySession(cookie, process.env.FIDELIS_SECRET, ip)) {
    return serveFile(res, 'public/fidelis-gate.html')
  }

  serveFile(res, 'public/fidelis/index.html')
}
