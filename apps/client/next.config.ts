import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "10000",
        pathname: "/devstoreaccount1/**",
        search: "",
      },
    ],
  },
}

export default withNextIntl(nextConfig)
