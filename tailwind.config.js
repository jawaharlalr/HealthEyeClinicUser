/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#0d9488',
          'teal-dark': '#0f766e',
          'teal-light': '#ccfbf1',
          'teal-bg': '#f0fdfa',
          blue: '#1e3a8a',
          'blue-medium': '#2563eb',
          'blue-light': '#eff6ff',
          pink: '#db2777',
          'pink-light': '#fdf2f8',
          slate: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(13, 148, 136, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(13, 148, 136, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'floating': '0 20px 40px -10px rgba(30, 58, 138, 0.15)'
      }
    },
  },
  plugins: [],
}
