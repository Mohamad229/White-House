import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(254 254 251)",
        stonewash: "rgb(238 236 229)",
        ink: "rgb(23 22 60)",
        muted: "rgb(128 129 133)",
        bone: "rgb(250 247 240)",
        caramel: "rgb(178 153 95)",
        brass: "rgb(229 197 130)"
      },
      fontFamily: {
        sans: ["var(--font-ui)", "Tahoma", "Segoe UI", "sans-serif"],
        display: ["var(--font-display)", "Arial Black", "Tahoma", "sans-serif"]
      },
      boxShadow: {
        bar: "0 -18px 60px oklch(0.16 0.006 78 / 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
