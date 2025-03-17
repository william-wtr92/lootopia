import { Toaster } from "@lootopia/ui"
import { Fredoka } from "next/font/google"
import "@client/app/globals.css"
import "leaflet/dist/leaflet.css"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { type ReactNode } from "react"

import { IntlClientProvider } from "@client/providers/NextIntlClientProvider"
import TanStackProvider from "@client/providers/TanstackProvider"
import Footer from "@client/web/components/layout/Footer"
import Navbar from "@client/web/components/layout/Navbar"
import TreasureMapBackground from "@client/web/components/layout/TreasureMapBackground"

export const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
})

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  return (
    <html lang={locale}>
      <body
        className={`${fredoka.className} flex min-h-screen flex-col antialiased`}
      >
        <NuqsAdapter>
          <IntlClientProvider>
            <TanStackProvider>
              <Navbar />
              <TreasureMapBackground />
              {children}
              <Toaster />
              <Footer />
            </TanStackProvider>
          </IntlClientProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
