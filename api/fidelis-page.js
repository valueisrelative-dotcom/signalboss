import { createHmac } from 'crypto'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const gateHtml = readFileSync(join(__dirname, 'fidelis-gate.html'), 'utf8')
const contentHtml = readFileSync(join(__dirname, 'fidelis-content.html'), 'utf8')

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

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 'no-store')

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.headers['x-real-ip'] || 'unknown'
  const cookie = getCookie(req, 'fidelis_session')

  if (!cookie || !verifySession(cookie, process.env.FIDELIS_SECRET, ip)) {
    return res.status(200).send(gateHtml)
  }

  res.status(200).send(contentHtml)
}
