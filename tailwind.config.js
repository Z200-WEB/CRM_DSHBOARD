/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        salesforce: {
          blue: '#0176d3',
          darkBlue: '#032d60',
          lightBlue: '#1b96ff',
          navy: '#001639',
          gray: '#706e6b',
          lightGray: '#f3f3f3',
        }
      }
    },
  },
  plugins: [],
}
