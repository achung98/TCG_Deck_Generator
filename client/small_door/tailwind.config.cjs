/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sb: "#F36A46",
        "sb-hard": "#F2623D",
        Colorless: "#C4C4C4",
        Darkness: "#050505",
        Dragon: "#2f2061",
        Fairy: "#CE82D1",
        Fighting: "#A87523",
        Fire: "#A82323",
        Grass: "#42A823",
        Lightning: "#D6C615",
        Metal: "#969695",
        Psychic: "#9C034F",
        Water: "#2504E0",
      },
      transitionDuration: {
        400: "400ms",
      },
      fontFamily: {
        def: ["Inter", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      keyframes: {
        heartbeat: {
          "0%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.2)" },
          "50%": { transform: "scale(1.5)" },
          "75%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "loading-heartbeat": "heartbeat 2s linear infinite",
      },
    },
  },
  plugins: [],
};
