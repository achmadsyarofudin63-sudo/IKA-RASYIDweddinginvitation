import './globals.css'

export const metadata = {
  title: 'Undangan Pernikahan Ika & Rasyid',
  description: 'Undangan digital pernikahan Ika & Rasyid, 9 Oktober 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@300;400;600&family=Playfair+Display:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
