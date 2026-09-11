export const runtime = 'nodejs'

export async function POST(req) {
  try {
    const { password } = await req.json()
    const correct = process.env.ADMIN_PASSWORD

    if (!correct) {
      return Response.json({ error: 'ADMIN_PASSWORD belum diset di environment variable Vercel.' }, { status: 500 })
    }

    if (password !== correct) {
      return Response.json({ error: 'Password salah' }, { status: 401 })
    }

    // Set cookie sesi sederhana (httpOnly, berlaku 24 jam)
    const headers = new Headers()
    headers.append('Set-Cookie', `admin_session=ok; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`)

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...Object.fromEntries(headers), 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
