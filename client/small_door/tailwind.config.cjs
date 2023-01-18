/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sb: "#F36A46",
        "sb-hard": "#F2623D",
      },
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  plugins: [],
};
