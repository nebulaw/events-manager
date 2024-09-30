import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        "event": "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
};
export default config;
