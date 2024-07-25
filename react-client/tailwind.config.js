/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");


export default withMT( {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors:{
      'amethyst': '#9a61bd'
    },
    extend: {
      scale:{
        '103': '1.03'
      }
    },
  },
  plugins: [],
})