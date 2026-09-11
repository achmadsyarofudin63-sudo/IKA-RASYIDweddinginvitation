import { getRedis } from '@/lib/redis'

export const runtime = 'nodejs'

const KEY = 'guests'

function isAuthorized(req) {
  const cookie = req.headers.get('cookie') || ''
  return cookie.includes('admin_session=ok')
}

async function readGuests() {
  const redis = getRedis()
  const raw = await redis.get(KEY)
  return raw ? JSON.parse(raw) : []
}

async function writeGuests(guests) {
  const redis = getRedis()
  await redis.set(KEY, JSON.stringify(guests))
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const guests = await readGuests()
  return Response.json({ guests })
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { name, phone } = body || {}
    if (!name?.trim() || !phone?.trim()) {
      return Response.json({ error: 'Nama dan nomor WA wajib diisi' }, { status: 400 })
    }

    const guests = await readGuests()
    const newGuest = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    }
    guests.push(newGuest)
    await writeGuests(guests)

    return Response.json({ guest: newGuest })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  if (!isAuthorized(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await req.json()
    const guests = await readGuests()
    const filtered = guests.filter((g) => g.id !== id)
    await writeGuests(filtered)
    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
