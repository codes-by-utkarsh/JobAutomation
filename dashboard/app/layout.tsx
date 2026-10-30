import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'The Beast - Autonomous Job Application Platform',
    description: 'Fully autonomous SaaS platform for job searching and applying with AI-powered automation',
    keywords: ['job automation', 'AI', 'job search', 'career', 'employment'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="gradient-bg min-h-screen">
                {children}
            </body>
        </html>
    )
}
