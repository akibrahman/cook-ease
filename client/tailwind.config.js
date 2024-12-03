/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: ["light"],
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#A32615",
        // secondary: "#F25864",
        primary: "#141515",
        secondary: "#141E30",
      },
    },
  },
  plugins: [require("daisyui")],
};
