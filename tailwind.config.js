export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wobble: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(1.5deg)" },
          "75%": { transform: "rotate(-1.5deg)" },
        },

        // Fade + Soft Zoom
        fadeZoomIn: {
          "0%":   { opacity: 0, transform: "scale(0.97)" },
          "100%": { opacity: 1, transform: "scale(1)" }
        },
      },

      animation: {
        wobble: "wobble 0.25s ease-in-out",

        // Fade + Soft Zoom
        fadeZoomIn: "fadeZoomIn 0.8s ease",
      },
    },
  },
  plugins: [],
};
