/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#3182f6',
        'surface': '#f8f9fb',
        'on-surface': '#191c1e',
        'on-surface-variant': '#4e5968',
        'outline-variant': '#e5e8eb',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
      },
      fontFamily: {
        'headline': ['Plus Jakarta Sans', 'Noto Sans KR', 'sans-serif'],
        'body': ['Inter', 'Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '3rem', '2xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
