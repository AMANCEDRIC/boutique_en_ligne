/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        // Logo « Maison Shein » : Brush Script (Windows/macOS), Dancing Script (Android/iOS, chargée via Google Fonts)
        script: ['"Brush Script MT"', '"Dancing Script"', 'cursive'],
      },
      colors: {
        'maison-gold': '#D4AF37',
        'maison-greige': '#F5F5F3',
        'maison-light-gray': '#E5E5E5',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        maison: {
          "primary": "#000000",
          "secondary": "#D4AF37",
          "accent": "#F5F5F3",
          "neutral": "#1a1c1c",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "dark",
    ],
  },
}


