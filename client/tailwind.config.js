/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#34C759',
        'primary-dark': '#2E9E4D',
        'primary-light': '#E6F7EC',
        'accent-blue': '#4CA9FF',
        'soft-beige': '#F9F7F4',
        'neutral-gray': '#E5E5E5',
      },
    },
  },
  plugins: [],
}