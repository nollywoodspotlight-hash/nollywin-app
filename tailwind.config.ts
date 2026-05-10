import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Nollywin Gold
        gold: "#b87209",
      },
      // Cinematic Noir Glow effects
      dropShadow: {
        gold: "0 0 20px rgba(184, 114, 9, 0.5)",
        "gold-strong": "0 0 35px rgba(184, 114, 9, 0.7)",
      },
      animation: {
        marquee: "marquee 90s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
