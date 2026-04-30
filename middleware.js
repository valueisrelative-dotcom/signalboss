export const config = { matcher: ['/(.*)',] }

async function verifyHmac(secret, payload, sig) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  )
  const sigBytes = new Uint8Array(sig.match(/../g).map(h => parseInt(h, 16)))
  return crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(payload))
}

function getCookie(request, name) {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'))
  return match ? match[1] : null
}

export default async function middleware(request) {
  const host = request.headers.get('host') || ''
  if (!host.startsWith('fidelis.')) return

  const url = new URL(request.url)
  const pathname = url.pathname

  if (pathname === '/fidelis-gate.html' || pathname.startsWith('/fidelis-admin') || pathname.startsWith('/api/fidelis-')) {
    return
  }

  const gateUrl = new URL('/fidelis-gate.html', request.url)
  const cookie = getCookie(request, 'fidelis_session')

  if (!cookie) return Response.redirect(gateUrl, 302)

  try {
    const [payload, sig] = cookie.split('.')
    if (!payload || !sig) return Response.redirect(gateUrl, 302)

    const valid = await verifyHmac(process.env.FIDELIS_SECRET, payload, sig)
    if (!valid) return Response.redirect(gateUrl, 302)

    const data = JSON.parse(atob(payload))
    if (Date.now() > data.exp) return Response.redirect(gateUrl, 302)

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
    if (data.ip !== ip) return Response.redirect(gateUrl, 302)
  } catch {
    return Response.redirect(gateUrl, 302)
  }
}
