import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: {
    default: "Lootopia",
    template: "%s | Lootopia",
    absolute: "Lootopia",
  },
  description:
    "Lootopia is an innovative platform, structured as an immersive ecosystem, dedicated to the participation and organisation of treasure hunts.",
  icons: {
    icon: "/logo.svg",
  },
}

const Layout = ({ children }: { children: ReactNode }) => children

export default Layout
