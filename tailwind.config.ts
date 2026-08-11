import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundLight: "#F2F0F1",
        cardBg: "#F0EEED",
        badgeRed: "#FF3333",
        starYellow: "#FFC633",
      },
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        integral: ["var(--font-integral)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;