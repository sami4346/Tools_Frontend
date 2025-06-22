/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          custom: '#ff0000', // Add a custom color to test
        },
      },
    },
    plugins: [],
};