import type { Config } from "tailwindcss"

export default {
  content: [
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/web/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config
