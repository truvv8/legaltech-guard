import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#121212",
          50: "#1A1A1A",
          100: "#161616",
          200: "#121212",
          300: "#0E0E0E",
          400: "#0A0A0A",
          500: "#060606",
        },
        navy: {
          DEFAULT: "#081424",
          light: "#0C1E36",
          dark: "#050E1A",
        },
        silver: {
          DEFAULT: "#C0C0C0",
          50: "#F0F0F0",
          100: "#E0E0E0",
          200: "#C0C0C0",
          300: "#999999",
          400: "#707070",
          500: "#505050",
        },
        platinum: {
          DEFAULT: "#E8E8E8",
          muted: "#888888",
        },
        accent: {
          gold: "#B8964E",
          emerald: "#2ECC71",
          red: "#E74C3C",
          blue: "#3498DB",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "mesh-drift": "meshDrift 20s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        meshDrift: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(10px, -10px) rotate(1deg)" },
          "66%": { transform: "translate(-5px, 5px) rotate(-0.5deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
