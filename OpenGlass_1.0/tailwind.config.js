/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/vue-tailwind-datepicker/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
          'dancingScript': ['Dancing Script', 'cursive']
      },
      colors: {
        "vtd-primary": colors.sky, // Light mode Datepicker color
        "vtd-secondary": colors.gray, // Dark mode Datepicker color
      },
      backgroundColor: {  // Add these lines
        'card-bg': '#F9FAFB',
      },
      borderRadius: {  // Add these lines
        'xl': '1.5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require("tw-elements/dist/plugin.cjs"),
    function ({ addUtilities }) {  // Add this plugin
      const newUtilities = {
        '.rounded-custom': {
          borderRadius: '13px',
        },
        '.border-opacity-custom': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '.bg-opacity-custom': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '.backdrop-blur-custom': {
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
        },
        '.isolation-custom': {
          isolation: 'isolate',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}
