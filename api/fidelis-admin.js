const GIST_FILE = 'fidelis-whitelist.json'

async function getGist() {
  const res = await fetch(`https://api.github.com/gists/${process.env.FIDELIS_WHITELIST_GIST_ID}`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'User-Agent': 'SignalBoss' }
  })
  if (!res.ok) throw new Error('Gist fetch failed')
  const gist = await res.json()
  const content = gist.files?.[GIST_FILE]?.content
  return content ? JSON.parse(content).emails : []
}

async function saveGist(emails) {
  await fetch(`https://api.github.com/gists/${process.env.FIDELIS_WHITELIST_GIST_ID}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'User-Agent': 'SignalBoss', 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: { [GIST_FILE]: { content: JSON.stringify({ emails }, null, 2) } } })
  })
}

export default async function handler(req, res) {
  if ((req.body?.token || req.query?.token) !== process.env.FIDELIS_ADMIN_KEY) return res.status(403).json({ error: 'Unauthorized' })

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ emails: await getGist() })
    }
    if (req.method === 'POST') {
      const { action, email } = req.body || {}
      const e = email?.trim().toLowerCase()
      if (!action || !e) return res.status(400).json({ error: 'action and email required' })

      let emails = await getGist()
      if (action === 'add') emails = [...new Set([...emails, e])]
      else if (action === 'remove') emails = emails.filter(x => x !== e)
      else return res.status(400).json({ error: 'Invalid action' })

      await saveGist(emails)
      return res.status(200).json({ ok: true, action, email: e })
    }
    res.status(405).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
