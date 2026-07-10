/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#c8a96e',
          light: '#e2c896',
          dim: '#9a7d50',
        },
        surface: {
          950: '#0d0704',  /* very dark walnut */
          900: '#100804',  /* dark mahogany */
          800: '#180e06',  /* rich dark wood */
          700: '#201408',  /* mid wood tone */
          600: '#2a1a0a',  /* lighter wood */
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.5)',
        'glow-gold': '0 0 24px rgba(200, 169, 110, 0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
