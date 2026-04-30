import { createHmac, randomInt } from 'crypto'

function sign(secret, payload) {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const email = req.body?.email?.trim().toLowerCase()
  if (!email) return res.status(400).json({ error: 'Email required' })

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.headers['x-real-ip'] || 'unknown'

  const code = String(randomInt(0, 1000000)).padStart(6, '0')
  const exp = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  const payload = btoa(JSON.stringify({ email, ip, code, exp }))
  const sig = sign(process.env.FIDELIS_SECRET, payload)
  const token = `${payload}.${sig}`

  // Send notification to you — forward to visitor if approved
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Signal Boss <onboarding@resend.dev>',
      to: ['info@signalboss.net'],
      subject: `Fidelis Access Request — ${email}`,
      text: [
        `New access request for Fidelis Capital.`,
        ``,
        `Visitor email: ${email}`,
        ``,
        `If approved, forward them this code:`,
        ``,
        `  ${code}`,
        ``,
        `They enter it at: https://fidelis.signalboss.net/fidelis-gate.html`,
        `Code expires in 24 hours.`,
      ].join('\n')
    })
  })

  if (!emailRes.ok) return res.status(500).json({ error: 'Failed to send request' })

  res.status(200).json({ token })
}
