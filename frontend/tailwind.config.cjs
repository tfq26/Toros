module.exports = {
  darkMode: 'media', // ← Add this line
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      colors: {
        white: '#ffffff',
        dark_green: '#33611d',
      },
      backgroundImage: {
        hero_gradient: 'radial-gradient(circle at left, #59b39a, #99f2c8)',
        // The custom_wave background uses a data URI for your SVG.
        custom_wave: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 900 600%27 preserveAspectRatio=%27none%27%3E%3Cpath d=%27M0 433L21.5 442.2C43 451.3 86 469.7 128.8 473.8C171.7 478 214.3 468 257.2 463.3C300 458.7 343 459.3 385.8 459.5C428.7 459.7 471.3 459.3 514.2 453.3C557 447.3 600 435.7 642.8 435.5C685.7 435.3 728.3 446.7 771.2 453.5C814 460.3 857 462.7 878.5 463.8L900 465L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z%27 fill=%27%233b82f6%27/%3E%3Cpath d=%27M0 484L21.5 486.5C43 489 86 494 128.8 496.3C171.7 498.7 214.3 498.3 257.2 498.2C300 498 343 498 385.8 498.2C428.7 498.3 471.3 498.7 514.2 498.8C557 499 600 499 642.8 499.2C685.7 499.3 728.3 499.7 771.2 499.8C814 500 857 500 878.5 500L900 500L900 601L878.5 601C857 601 814 601 771.2 601C728.3 601 685.7 601 642.8 601C600 601 557 601 514.2 601C471.3 601 428.7 601 385.8 601C343 601 300 601 257.2 601C214.3 601 171.7 601 128.8 601C86 601 43 601 21.5 601L0 601Z%27 fill=%27%23a855f7%27/%3E%3C/svg%3E')",
      },
      fontFamily: {
        hero_header: ['system-ui', 'sans-serif'],
        about_item: ['system-ui', 'sans-serif'],
      },
      animation: {
        slow_spin: 'spin 5s linear infinite',
        glow: 'wiggle 2s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
    },
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
          {
            'text-shadow': (value) => ({
              textShadow: value,
            }),
          },
          { values: theme('textShadow') }
      );
    },
  ],
  safelist: [
    'text-shadow-sm',
    'text-shadow',
    'text-shadow-lg',
  ],
};
