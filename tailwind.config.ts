import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0118",
        surface: "#140B26",
        edge: "#2A1B4A",
        primary: "#8B5CF6",
        accent: "#A855F7",
        magenta: "#D946EF",
        ink: "#F3EFFF",
        muted: "#9D8FC0",
        success: "#34D399",
        warn: "#FBBF24",
        danger: "#FB7185",
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        neon: "0 0 24px rgba(168,85,247,.45)",
        "neon-lg": "0 0 48px rgba(168,85,247,.55)",
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
