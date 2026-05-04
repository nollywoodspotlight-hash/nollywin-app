import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // This is the "Wide-Net" - it looks in ALL subfolders of src
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // These are backups to ensure the root folders are covered
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nolly: {
          gold: "#FFD700", // Cinematic Gold
          red: "#E50914", // Drama Red
          black: "#0A0A0A", // Deep Theater Black
          gray: "#1F1F1F", // Studio Gray
        },
      },
      // Adding this to make sure standard colors work perfectly
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
