import type React from "react"
import type { Metadata } from "next"
import "../src/index.css"

export const metadata: Metadata = {
  title: "Qwikish Tasks - Advanced Task Management",
  description: "Advanced task management application for productivity",
    generator: 'v0.dev'
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
