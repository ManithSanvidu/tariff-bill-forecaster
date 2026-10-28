/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mac: {
          bg: "#ece5f0",
          card: "#ffffff",
          subtle: "#f5f3f7",
          border: "#e5e0ea",
          blue: "#5865F2",
          blueHover: "#4752c4",
          red: "#ff5f56",
          yellow: "#ffbd2e",
          green: "#27c93f",
          dark: "#1e1e24",
          muted: "#6b7280"
        }
      },
      boxShadow: {
        'mac-window': '0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
        'mac-elevated': '0 10px 25px -5px rgba(88, 101, 242, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
      }
    },
  },
  plugins: [],
}
