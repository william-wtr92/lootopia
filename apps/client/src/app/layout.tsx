import { Toaster } from "@lootopia/ui"
import { Fredoka } from "next/font/google"
import "./globals.css"
import { type ReactNode } from "react"

import TanStackProvider from "@client/providers/TanstackProvider"
import Navbar from "@client/web/components/layout/Navbar"
import TreasureMapBackground from "@client/web/components/layout/TreasureMapBackground"

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.className} antialiased`}>
        <TanStackProvider>
          <main>
            <Navbar />
            <TreasureMapBackground />
            {children}
          </main>
          <Toaster />
        </TanStackProvider>
      </body>
    </html>
  )
}
