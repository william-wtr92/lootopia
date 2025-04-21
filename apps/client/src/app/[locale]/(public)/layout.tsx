import { Toaster } from "@lootopia/ui"
import "@client/app/globals.css"
import "leaflet/dist/leaflet.css"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { type ReactNode } from "react"

import { fredoka } from "@client/app/layout"
import { IntlClientProvider } from "@client/providers/NextIntlClientProvider"
import TanStackProvider from "@client/providers/TanstackProvider"
import Footer from "@client/web/components/layout/Footer"
import Navbar from "@client/web/components/layout/Navbar"
import TreasureMapBackground from "@client/web/components/layout/TreasureMapBackground"
import CookieConsent from "@client/web/components/utils/cookies/CookieConsent"

export default function PublicLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
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

            <CookieConsent />
          </TanStackProvider>
        </IntlClientProvider>
      </NuqsAdapter>
    </body>
  )
}
