/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // MealMitra brand palette -- named after the kitchen, not a generic scale
        turmeric: {
          50: "#fdf5e8",
          100: "#f9e6c2",
          400: "#eda93f",
          500: "#e3922b",
          600: "#c97a1c",
          700: "#a25f14",
        },
        masala: {
          500: "#a13a2a",
          600: "#7a2e22",
          700: "#5c2119",
        },
        cream: {
          DEFAULT: "#fbf3e6",
          100: "#fdf9f1",
        },
        steel: {
          300: "#c7cdd6",
          400: "#9aa4b2",
          500: "#6b7684",
        },
        leaf: {
          600: "#3a4a35",
          700: "#2f3b2e",
        },
        ink: "#2a2420",
        // keep "primary" as an alias to turmeric so any un-migrated classes still resolve
        primary: {
          50: "#fdf5e8",
          100: "#f9e6c2",
          500: "#e3922b",
          600: "#c97a1c",
          700: "#a25f14",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};