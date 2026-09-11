'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Target waktu acara Akad Nikah (WIB = UTC+7)
const EVENT_DATE = new Date('2026-10-09T08:00:00+07:00')

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0, done: false })

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0, done: true })
        return
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / (1000 * 60)) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setTimeLeft({ d, h, m, s, done: false })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [target])

  return timeLeft
}

function InvitationContent() {
  const searchParams = useSearchParams()
  const namaTamu = searchParams.get('to') || 'Tamu Undangan'
  const countdown = useCountdown(EVENT_DATE)

  const mapsUrl = "https://www.google.com/maps/place/7%C2%B040'42.6%22S+110%C2%B004'29.1%22E/@-7.6788294,110.0733335,17.53z"
  const mapsEmbedUrl = 'https://www.google.com/maps?q=-7.6784983,110.07476&output=embed'

  return (
    <div className="container">
      {/* HEADER / COVER */}
      <header className="hero">
        <p className="title-sub">Undangan Pernikahan</p>
        <h1 className="title-names">Ika &amp; Rasyid</h1>
        <p style={{ fontSize: '0.9rem', color: '#555' }}>9 Oktober 2026</p>

        <div className="guest-box">
          <p className="guest-title">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <div className="guest-name">{namaTamu}</div>
        </div>
      </header>

      {/* COUNTDOWN */}
      <section className="section countdown-section">
        <h2 className="section-title">Menuju Hari Bahagia</h2>
        {countdown.done ? (
          <p className="countdown-done">Acara sedang/telah berlangsung 🎉</p>
        ) : (
          <div className="countdown-grid">
            <div className="countdown-box"><span>{countdown.d}</span><small>Hari</small></div>
            <div className="countdown-box"><span>{countdown.h}</span><small>Jam</small></div>
            <div className="countdown-box"><span>{countdown.m}</span><small>Menit</small></div>
            <div className="countdown-box"><span>{countdown.s}</span><small>Detik</small></div>
          </div>
        )}
      </section>

      {/* FOTO BERSAMA */}
      <section className="section" style={{ padding: '30px 20px' }}>
        <img src="/foto-berdua.jpg" alt="Ika & Rasyid" className="couple-photo" />
      </section>

      {/* MEMPELAI SECTION */}
      <section className="section">
        <p className="quote">
          "Maha Suci Allah yang telah menciptakan pasangan-pasangan semuanya, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka maupun dari apa yang tidak mereka ketahui."
        </p>

        <div className="couple-profile">
          <img src="/foto-ika.jpg" alt="Ika Kurniyawati Azizah" className="profile-img" />
          <div className="couple-name">Ika Kurniyawati Azizah (Ika)</div>
          <div className="couple-parents">Putri Pertama dari Bapak Amat Riyadi &amp; Ibu Nurhidayah</div>
          <div className="couple-address">Medut 03/01 Tepansari, Loano, Purworejo</div>
        </div>

        <div className="ampersand">&amp;</div>

        <div className="couple-profile">
          <img src="/foto-rasyid.jpg" alt="Rasyid Sidik" className="profile-img" />
          <div className="couple-name">Rasyid Sidik (Rasyid)</div>
          <div className="couple-parents">Putra Kedua dari Bapak Amat Sulaiman &amp; Ibu Marminah</div>
          <div className="couple-address">Dukuh 02/03 Banyuasin Kembaran, Loano, Purworejo</div>
        </div>
      </section>

      {/* DETAIL ACARA */}
      <section className="section" style={{ backgroundColor: '#faf9f6' }}>
        <h2 className="section-title">Waktu &amp; Lokasi</h2>

        <div className="event-card">
          <div className="event-title">AKAD NIKAH</div>
          <div className="event-date">Jumat, 9 Oktober 2026</div>
          <div className="event-time">Pukul: 08.00 WIB</div>
        </div>

        <div className="event-card">
          <div className="event-title">RESEPSI</div>
          <div className="event-date">Jumat, 9 Oktober 2026</div>
          <div className="event-time">Pukul: 09.00 WIB - Selesai</div>
        </div>

        <div className="event-card">
          <div className="event-title" style={{ color: '#5a4a3a' }}>LOKASI ACARA</div>
          <div className="event-location">
            <strong>Dikediaman Mempelai Wanita</strong><br />
            Medut 03/01 Tepansari, Loano, Purworejo
          </div>
        </div>

        {/* DENAH / PETA */}
        <div className="map-wrapper">
          <iframe
            title="Lokasi Acara"
            src={mapsEmbedUrl}
            width="100%"
            height="220"
            style={{ border: 0, borderRadius: '10px' }}
            allowFullScreen=""
            loading="lazy"
          />
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="maps-btn">
            📍 Buka di Google Maps
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
        <br />
        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Kami yang berbahagia,</p>
        <div className="title-names">Ika &amp; Rasyid</div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; color: #333; background-color: #f9f8f6; line-height: 1.6; text-align: center; }
        .container { max-width: 480px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 0 20px rgba(0,0,0,0.05); min-height: 100vh; overflow: hidden; position: relative; }
        .hero { padding: 50px 20px 30px; background: linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600') center/cover; border-bottom: 2px solid #e8e3d9; }
        .title-sub { font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: #8c7b6c; margin-bottom: 10px; }
        .title-names { font-family: 'Great Vibes', cursive; font-size: 3rem; color: #5a4a3a; margin: 10px 0; }
        .guest-box { margin-top: 25px; padding: 15px; background-color: rgba(255,255,255,0.9); border-radius: 8px; border: 1px solid #e8e3d9; display: inline-block; width: 90%; }
        .guest-title { font-size: 0.8rem; color: #666; text-transform: uppercase; }
        .guest-name { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 600; color: #5a4a3a; margin-top: 5px; }
        .section { padding: 40px 20px; border-bottom: 1px solid #f0ece6; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #5a4a3a; margin-bottom: 20px; }
        .quote { font-size: 0.85rem; color: #666; margin-bottom: 25px; font-style: italic; }
        .couple-profile { margin: 30px 0; }
        .profile-img { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid #f4f0ea; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 15px; }
        .couple-photo { width: 100%; border-radius: 12px; object-fit: cover; max-height: 320px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
        .couple-name { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 600; color: #4a3d31; }
        .couple-parents { font-size: 0.85rem; color: #666; margin-top: 5px; }
        .couple-address { font-size: 0.8rem; color: #888; font-style: italic; margin-top: 3px; }
        .ampersand { font-family: 'Great Vibes', cursive; font-size: 2.5rem; color: #8c7b6c; margin: 15px 0; }
        .event-card { background-color: #fcfbf9; border: 1px solid #ebe6dd; border-radius: 10px; padding: 25px 15px; margin-bottom: 20px; }
        .event-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #8c7b6c; letter-spacing: 1px; margin-bottom: 10px; font-weight: 600; }
        .event-date { font-size: 1rem; font-weight: 600; color: #333; }
        .event-time { font-size: 0.9rem; color: #555; margin-top: 5px; }
        .event-location { font-size: 0.85rem; color: #666; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ddd; }
        .map-wrapper { margin-top: 10px; }
        .maps-btn { display: inline-block; margin-top: 12px; padding: 10px 18px; background: #5a4a3a; color: #fff; text-decoration: none; border-radius: 6px; font-size: 0.85rem; }
        .countdown-section { background: #fcfbf9; }
        .countdown-grid { display: flex; justify-content: center; gap: 10px; margin-top: 10px; }
        .countdown-box { background: #5a4a3a; color: #fff; border-radius: 8px; padding: 12px 10px; min-width: 60px; }
        .countdown-box span { display: block; font-size: 1.5rem; font-weight: 700; font-family: 'Playfair Display', serif; }
        .countdown-box small { font-size: 0.65rem; letter-spacing: 1px; text-transform: uppercase; opacity: 0.8; }
        .countdown-done { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #5a4a3a; }
        .footer { padding: 30px 20px; background-color: #5a4a3a; color: #fff; font-size: 0.85rem; }
        .footer .title-names { color: #f4f0ea; font-size: 2.2rem; }
      `}</style>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: 40 }}>Memuat undangan...</div>}>
        <InvitationContent />
      </Suspense>
    </>
  )
}
