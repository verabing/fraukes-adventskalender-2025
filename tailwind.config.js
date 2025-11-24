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

        // NEU: Fade + Slide
        fadeSlideLeft: {
          "0%":   { opacity: 0, transform: "translateX(-40px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        fadeSlideRight: {
          "0%":   { opacity: 0, transform: "translateX(40px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
      },

      animation: {
        wobble: "wobble 0.25s ease-in-out",

        // NEU: Fade + Slide
        fadeSlideLeft: "fadeSlideLeft 0.45s ease",
        fadeSlideRight: "fadeSlideRight 0.45s ease",
      },
    },
  },
  plugins: [],
};


