/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        "group-grid": "repeat(2, minmax(300px, 420px))",
        "4-1": "4fr 1fr",
        "4-1-1": "4fr 1fr 1fr",
        "main-container-3": "minmax(240px, auto) 1fr minmax(240px, auto)",
        "main-container-2": "240px auto",
        "65-25px-64px": "65% 25px 64px",
        "55-35": "55% 35%",
        "auto-auto": "auto auto",
        "20px-200px": "20px 200px",
      },
      gridTemplateRows: {
        "max-auto": "max-content auto",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      screens: {
        "1700px": "1700px",
        "1150px": "1150px",
      },
      colors: {
        blue: {
          100: "#f3faff",
          300: "#c2e8ff",
          500: "#5480b1",
          800: "#052b6a",
          900: "#052355",
        },
        red: {
          500: "#e30613",
          600: "#d60e1a",
        },
        black: {
          900: "#000f22",
        },
        gray: {
          100: "#f6f7f8",
          300: "#dadada",
          500: "#b5b5b5",
        },
      },
    },
  },
  plugins: [],
};
