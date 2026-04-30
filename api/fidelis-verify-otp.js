import { createHmac } from 'crypto'

const SESSION_TTL_MS = 3 * 24 * 60 * 60 * 1000
const SESSION_TTL_S = 3 * 24 * 60 * 60

function sign(secret, payload) {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { token, code } = req.body || {}
  if (!token || !code) return res.status(400).json({ error: 'Missing fields' })

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.headers['x-real-ip'] || 'unknown'

  try {
    const [payload, sig] = token.split('.')
    if (sign(process.env.FIDELIS_SECRET, payload) !== sig) throw new Error('bad sig')

    const data = JSON.parse(atob(payload))
    if (Date.now() > data.exp) return res.status(401).json({ error: 'Code has expired.' })
    if (data.ip !== ip) return res.status(403).json({ error: 'This code can only be used from the same network where it was requested.' })
    if (data.code !== String(code).trim()) return res.status(401).json({ error: 'Invalid code.' })

    const sessionPayload = btoa(JSON.stringify({ email: data.email, ip, exp: Date.now() + SESSION_TTL_MS }))
    const sessionSig = sign(process.env.FIDELIS_SECRET, sessionPayload)

    res.setHeader('Set-Cookie', `fidelis_session=${sessionPayload}.${sessionSig}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_S}`)
    res.status(200).json({ ok: true })
  } catch {
    res.status(401).json({ error: 'Invalid or expired code.' })
  }
}
