/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4f46e5",
          secondary: "#0ea5e9",
        },
      },
      spacing: {
        18: "4.5rem",
      },
      fontSize: {
        base: "14px",
        lg: "16px",
        xl: "20px",
      },
    },
  },
  plugins: [],
};
