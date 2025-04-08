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
  safelist: [
    "bg-gradient-to-r",
    "from-amber-400",
    "to-amber-600",
    "from-blue-400",
    "to-blue-600",
    "from-purple-500",
    "to-purple-700",
    "from-emerald-400",
    "to-emerald-600",
    "from-rose-500",
    "to-rose-700",
  ],
  plugins: [tailwindcssAnimate],
} satisfies Config
