/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        sable: "#F5EDE3",
        creme: "#FAF7F2",
        terracotta: {
          DEFAULT: "#B5652E",
          light: "#D98A55",
          dark: "#8C4B21",
        },
        sauge: {
          DEFAULT: "#8A9A7B",
          light: "#A9B79C",
          dark: "#6C7A5F",
        },
        brun: "#4A3B31",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Work Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
