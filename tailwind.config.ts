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
        gold: "#b87209",
      },
      // This is the engine that drives the Marquee
      animation: {
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      // This enables the "Neon" glow for the marquee text
      dropShadow: {
        gold: "0 0 10px rgba(184, 114, 9, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
