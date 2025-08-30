import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aether - AI Website Builder',
  description: 'Create professional websites in 30 seconds with AI',
  keywords: 'AI, website builder, no-code, website generator, AI website',
  authors: [{ name: 'Aether Team' }],
  openGraph: {
    title: 'Aether - AI Website Builder',
    description: 'Create professional websites in 30 seconds with AI',
    url: 'https://aether.ai',
    siteName: 'Aether',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aether - AI Website Builder',
    description: 'Create professional websites in 30 seconds with AI',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}