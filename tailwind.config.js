/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        pl:'#bb77fe',
        yl:'#fffe52',
      },
    },
  },
  plugins: [],
}