/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#171717',
          hover: '#2a2a2a',
          active: '#333333',
        },
        chat: {
          DEFAULT: '#212121',
          bubble: '#2f2f2f',
        },
      },
    },
  },
  plugins: [],
};
