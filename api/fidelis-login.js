import { createHmac } from 'crypto'

const SESSION_TTL_S = 3 * 24 * 60 * 60

function sign(secret, payload) {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body || {}
  if (!password || password !== process.env.FIDELIS_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password.' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.headers['x-real-ip'] || 'unknown'
  const payload = btoa(JSON.stringify({ ip, exp: Date.now() + SESSION_TTL_S * 1000 }))
  const sig = sign(process.env.FIDELIS_SECRET, payload)

  res.setHeader('Set-Cookie', `fidelis_session=${payload}.${sig}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_S}`)
  res.status(200).json({ ok: true })
}
