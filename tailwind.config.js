/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#93C5FD',
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
        },
      },
    },
  },
  plugins: [],
};