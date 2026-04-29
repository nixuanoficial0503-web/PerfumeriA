import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'NOIR·ESSENCE — Perfumería Nicho',
    template: '%s | NOIR·ESSENCE',
  },
  description: 'Fragancias de autor. Cada perfume, una historia.',
  keywords: ['perfumes', 'fragancias', 'nicho', 'Colombia', 'oud', 'luxury'],
  authors: [{ name: 'NOIR·ESSENCE' }],
  creator: 'NOIR·ESSENCE',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'NOIR·ESSENCE',
    title: 'NOIR·ESSENCE — Perfumería Nicho',
    description: 'Fragancias de autor. Cada perfume, una historia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOIR·ESSENCE',
    description: 'Fragancias de autor. Cada perfume, una historia.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-ink text-paper antialiased">
        {children}
      </body>
    </html>
  )
}
