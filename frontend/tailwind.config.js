/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        /* 🌌 BACKGROUND LAYERS */
        canvas: "#0B0F0E",        // app background base
        surface: "#121A17",       // cards
        surfaceElevated: "#1D2331", // navbar, modals

        /* ⚡ ACCENTS */
        accentPrimary: "#8EFF01", // neon green
        accentSecondary: "#8B53FE", // neon purple

        /* 📝 TEXT */
        textPrimary: "#EDEDED",
        textMuted: "#9CA3AF",
      },
      boxShadow: {
       glowPrimary: "0 0 30px rgba(142,255,1,0.45)",
        glowSecondary: "0 0 30px rgba(139,83,254,0.45)",
      },
    },
  },
  plugins: [],
};


