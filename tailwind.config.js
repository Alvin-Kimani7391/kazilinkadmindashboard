/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KaziLink Brand Colors
        primary: '#FFB84D',
        primaryLight: '#FFD08A',
        primaryDark: '#E69A30',
        navy: '#1A253F',
        navyLight: '#2A3A5F',
        navyDark: '#0F1525',
        surface: '#F8F9FA',
        success: '#28A745',
        error: '#DC3545',
        warning: '#FFC107',
        info: '#17A2B8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}