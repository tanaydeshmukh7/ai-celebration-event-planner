import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F4",
        foreground: "#222126",
        plum: {
          50: "#F7F2F8",
          100: "#EEDEEF",
          200: "#DEBEDF",
          300: "#CA99CC",
          400: "#B070B3",
          500: "#8E4A92",
          600: "#6F3274",
          700: "#5D2962",
          800: "#4C234F", // Primary deep plum
          900: "#3E1C40",
          950: "#270F28",
        },
        coral: {
          50: "#FFF4F1",
          100: "#FFE6E1",
          200: "#FFCFC5",
          300: "#FFB0A0",
          400: "#FF917C",
          500: "#FF8066", // Accent coral
          600: "#ED5C3D",
          700: "#C94225",
          800: "#A3351C",
          900: "#842F1B",
        },
        lavender: {
          50: "#F8F6FC",
          100: "#F1EDF9",
          200: "#EAE3F4", // Secondary accent soft lavender
          300: "#D6C7E9",
          400: "#BDA5DC",
          500: "#A382CD",
        },
        warmgray: {
          50: "#FDFBF7",
          100: "#F7F4EE",
          200: "#ECE7DE",
          300: "#DED7CA",
          400: "#BEB4A3",
          500: "#998E7D",
          600: "#756B5B",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(34, 33, 38, 0.05), 0 4px 6px -2px rgba(34, 33, 38, 0.02)",
        hover: "0 10px 25px -3px rgba(76, 35, 79, 0.08), 0 4px 6px -2px rgba(76, 35, 79, 0.03)",
        card: "0 1px 3px 0 rgba(34, 33, 38, 0.04), 0 1px 2px -1px rgba(34, 33, 38, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
