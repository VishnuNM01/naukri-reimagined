/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F7F7F4",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#16202B",
          soft: "#55636F",
          faint: "#8B96A0",
        },
        border: {
          DEFAULT: "#E1E4DF",
          strong: "#C8CDC6",
        },
        primary: {
          DEFAULT: "#1F3B57",
          hover: "#16293D",
          soft: "#E7EDF1",
        },
        accent: {
          DEFAULT: "#B9791F",
          soft: "#F5EAD6",
        },
        success: {
          DEFAULT: "#2F7A4F",
          soft: "#E6F1EA",
        },
        warning: {
          DEFAULT: "#9C6A17",
          soft: "#FBF1DD",
        },
        danger: {
          DEFAULT: "#A6403D",
          soft: "#F8EAE9",
        },
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', "Georgia", "serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};
