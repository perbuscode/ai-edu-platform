// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0f172a",        // slate-900
          surface: "#ffffff",   // white
          subtle: "#f8fafc",    // slate-50
          card: "#ffffff",
          border: "#e2e8f0",    // slate-200
          text: "#0f172a",      // slate-900
          mute: "#475569",      // slate-600
          accent: "#0284c7",    // sky-600
        },
      },
    },
  },
  plugins: [],
};
