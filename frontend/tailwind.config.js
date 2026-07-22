/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B0E14',
        panel: '#12161F',
        grid: '#1A2130',
        line: '#232B3A',
        text: '#EDEFF3',
        muted: '#7C8798',
        c3d: '#66FFE0',
        'c3d-soft': '#143733',
        cdig: '#8C7CFF',
        'cdig-soft': '#211C40',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}