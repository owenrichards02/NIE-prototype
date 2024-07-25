/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");


export default withMT( {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors:{
      'amethyst': '#8400ff'
    },
    extend: {
      scale:{
        '103': '1.03'
      }
    },
  },
  plugins: [],
})