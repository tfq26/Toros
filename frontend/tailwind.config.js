/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your custom colors
        'davys-gray': {
          500: '#545454',
        },
        'eerie-black': {
          500: '#1d1f20',
        },
        'slate-gray': {
          100: '#e1e3e5',
          300: '#3f464a',
          500: '#69747c',
        },
        'asparagus': {
          500: '#6baa75',
        },
        'sgbus-green': {
          500: '#84dd63',
        },
        'lime': {
          500: '#cbff4d',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
