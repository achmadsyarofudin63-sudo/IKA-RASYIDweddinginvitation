'use client'

import { useEffect, useState } from 'react'

const DOMAIN_PLACEHOLDER = typeof window !== 'undefined' ? window.location.origin : ''

function buildMessage(name, link) {
  return `Bismillahirrahmanirrahim, Kepada Yth. Bapak/Ibu/Saudara/i ${name}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir pada acara pernikahan kami. Untuk detail acara, lokasi, dan foto, silakan buka tautan undangan digital berikut:

${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

Kami yang berbahagia, Ika & Rasyid`
}

function formatPhoneForWa(phone) {
  let p = phone.replace(/[^0-9]/g, '')
  if (p.startsWith('0')) p = '62' + p.slice(1)
  if (!p.startsWith('62')) p = '62' + p
  return p
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    fetchGuests()
  }, [])

  const fetchGuests = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/guests')
      if (res.status === 401) { setAuthed(false); setLoading(false); return }
      const data = await res.json()
      setGuests(data.guests || [])
      setAuthed(true)
    } catch (e) { /* diamkan, tetap di layar login */ }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    try {
      const res = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal login')
      setAuthed(true)
      fetchGuests()
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setLoggingIn(false)
    }
  }

  const handleAddGuest = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGuests((prev) => [...prev, data.guest])
      setName('')
      setPhone('')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus tamu ini?')) return
    await fetch('/api/guests', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setGuests((prev) => prev.filter((g) => g.id !== id))
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1410', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: '#241c16', padding: 32, borderRadius: 12, width: 320 }}>
          <h1 style={{ color: '#f4f0ea', fontSize: 18, marginBottom: 16 }}>Admin — Undangan Ika &amp; Rasyid</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password admin"
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #5a4a3a', background: '#1a1410', color: '#fff', marginBottom: 12 }}
          />
          {loginError && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 10 }}>{loginError}</p>}
          <button type="submit" disabled={loggingIn} style={{ width: '100%', padding: 10, borderRadius: 8, background: '#5a4a3a', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {loggingIn ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1410', fontFamily: 'sans-serif', color: '#f4f0ea', padding: 24 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>Admin — Daftar Tamu</h1>
        <p style={{ fontSize: 13, color: '#a89a8a', marginBottom: 24 }}>Undangan Ika &amp; Rasyid · {guests.length} tamu terdaftar</p>

        {/* Form tambah tamu */}
        <form onSubmit={handleAddGuest} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama tamu"
            style={{ flex: 1, minWidth: 160, padding: 10, borderRadius: 8, border: '1px solid #5a4a3a', background: '#241c16', color: '#fff' }}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="No. WA (08xxx atau 62xxx)"
            style={{ flex: 1, minWidth: 160, padding: 10, borderRadius: 8, border: '1px solid #5a4a3a', background: '#241c16', color: '#fff' }}
          />
          <button type="submit" style={{ padding: '10px 18px', borderRadius: 8, background: '#8c7b6c', color: '#fff', border: 'none', cursor: 'pointer' }}>
            + Tambah
          </button>
        </form>

        {/* Daftar tamu */}
        {loading ? (
          <p>Memuat...</p>
        ) : guests.length === 0 ? (
          <p style={{ color: '#a89a8a' }}>Belum ada tamu ditambahkan.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {guests.map((g) => {
              const link = `${origin || DOMAIN_PLACEHOLDER}/?to=${encodeURIComponent(g.name)}`
              const msg = buildMessage(g.name, link)
              const waUrl = `https://wa.me/${formatPhoneForWa(g.phone)}?text=${encodeURIComponent(msg)}`
              return (
                <div key={g.id} style={{ background: '#241c16', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 600 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: '#a89a8a' }}>{g.phone}</div>
                  </div>
                  <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#93c5fd' }}>
                    Lihat Link
                  </a>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: '8px 14px', borderRadius: 8, background: '#22c55e', color: '#052e16', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
                  >
                    Kirim WA
                  </a>
                  <button
                    onClick={() => handleDelete(g.id)}
                    style={{ padding: '8px 12px', borderRadius: 8, background: 'transparent', border: '1px solid #7f1d1d', color: '#f87171', cursor: 'pointer', fontSize: 12 }}
                  >
                    Hapus
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <p style={{ fontSize: 11, color: '#6b5d4f', marginTop: 32 }}>
          Klik "Kirim WA" akan membuka WhatsApp dengan pesan sudah terisi otomatis — kamu tinggal menekan tombol kirim di WhatsApp-nya per tamu (WhatsApp tidak mengizinkan kirim otomatis massal tanpa WhatsApp Business API).
        </p>
      </div>
    </div>
  )
}
