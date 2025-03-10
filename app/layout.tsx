import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Sleep Regression',
  description: 'A game about managing sleeping babies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
