/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      },
      colors: {
       'spring-leaves': {
    '50': '#f2f7f4',
    '100': '#e0ebe3',
    '200': '#c2d8c9',
    '300': '#99bca6',
    '400': '#6d9a80',
    '500': '#508367',
    '600': '#39624c',
    '700': '#2d4f3e',
    '800': '#263f33',
    '900': '#20342b',
    '950': '#111d17',
},
      }
    },
  },
  plugins: [],
};

//
