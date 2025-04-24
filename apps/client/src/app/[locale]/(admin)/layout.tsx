import { Toaster } from "@lootopia/ui"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import React, { type ReactNode } from "react"
import "@client/app/globals.css"

import { fredoka } from "../(public)/layout"
import { IntlClientProvider } from "@client/providers/NextIntlClientProvider"
import TanStackProvider from "@client/providers/TanstackProvider"
import AdminNavbar from "@client/web/components/layout/admin/navbar/AdminNavbar"
import TreasureMapBackground from "@client/web/components/layout/TreasureMapBackground"

type Props = {
  children: ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <body
      className={`${fredoka.className} flex min-h-screen flex-row antialiased`}
    >
      <NuqsAdapter>
        <IntlClientProvider>
          <TanStackProvider>
            <TreasureMapBackground />
            <AdminNavbar />
            {children}
            <Toaster />
          </TanStackProvider>
        </IntlClientProvider>
      </NuqsAdapter>
    </body>
  )
}
