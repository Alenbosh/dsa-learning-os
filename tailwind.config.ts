import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "text-zinc-400",
    "text-blue-400",
    "text-amber-400",
    "text-emerald-400",
    "text-rose-400",
    "text-orange-400",
    "text-green-400",
    "text-purple-400",
    "text-pink-400",
    "text-cyan-400",
    "bg-zinc-400/10",
    "bg-blue-400/10",
    "bg-amber-400/10",
    "bg-emerald-400/10",
    "bg-rose-400/10",
    "bg-orange-400/10",
    "bg-green-400/10",
    "bg-purple-400/10",
    "bg-pink-400/10",
    "bg-cyan-400/10",
    "border-zinc-400/20",
    "border-blue-400/20",
    "border-amber-400/20",
    "border-emerald-400/20",
    "border-rose-400/20",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
