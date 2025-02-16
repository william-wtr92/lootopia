import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

export default {
  content: [
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/web/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        accentHover: "var(--accent-hover)",
        primaryBg: "var(--primary-bg)",
        secondaryBg: "var(--secondary-bg)",
        error: "var(--error)",
        success: "var(--success)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config
