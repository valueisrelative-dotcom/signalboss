import { createHmac, randomInt } from 'crypto'

function sign(secret, payload) {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

async function getWhitelist() {
  const res = await fetch(`https://api.github.com/gists/${process.env.FIDELIS_WHITELIST_GIST_ID}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'User-Agent': 'SignalBoss' }
  })
  if (!res.ok) return []
  const gist = await res.json()
  const content = gist.files?.['fidelis-whitelist.json']?.content
  return content ? JSON.parse(content).emails : []
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const email = req.body?.email?.trim().toLowerCase()
  if (!email) return res.status(400).json({ error: 'Email required' })

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.headers['x-real-ip'] || 'unknown'

  const whitelist = await getWhitelist()
  if (!whitelist.includes(email)) return res.status(403).json({ error: 'This email is not authorized for access.' })

  const code = String(randomInt(0, 1000000)).padStart(6, '0')
  const exp = Date.now() + 15 * 60 * 1000
  const payload = btoa(JSON.stringify({ email, ip, code, exp }))
  const sig = sign(process.env.FIDELIS_SECRET, payload)
  const token = `${payload}.${sig}`

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Signal Boss <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Fidelis Capital Access Code',
      html: `<div style="font-family:Georgia,serif;background:#070706;color:#F5F2EB;padding:40px;max-width:480px">
        <h2 style="color:#D4A843;font-weight:400">Fidelis Capital</h2>
        <p style="margin:24px 0 8px">Your one-time access code:</p>
        <div style="font-size:40px;letter-spacing:10px;color:#D4A843;padding:20px;border:1px solid rgba(212,168,67,0.3);text-align:center">${code}</div>
        <p style="color:rgba(245,242,235,0.5);font-size:13px;margin-top:16px">Expires in 15 minutes. Only valid from this network.</p>
      </div>`
    })
  })

  if (!emailRes.ok) return res.status(500).json({ error: 'Failed to send access code' })

  res.status(200).json({ token })
}
