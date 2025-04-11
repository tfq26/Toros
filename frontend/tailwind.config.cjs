module.exports = {
  darkMode: ['media', 'class'], // ← Add this line
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
  	extend: {
  		textShadow: {
  			sm: '0 1px 2px var(--tw-shadow-color)',
  			DEFAULT: '0 2px 4px var(--tw-shadow-color)',
  			lg: '0 8px 16px var(--tw-shadow-color)'
  		},
  		colors: {
  			white: '#ffffff',
  			dark_green: '#33611d'
  		},
  		backgroundImage: {
  			hero_gradient: 'radial-gradient(circle at left, #59b39a, #99f2c8)'
  		},
  		fontFamily: {
  			hero_header: [
  				'system-ui',
  				'sans-serif'
  			],
  			about_item: [
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		animation: {
  			slow_spin: 'spin 5s linear infinite',
  			glow: 'wiggle 2s linear infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			wiggle: {
  				'0%, 100%': {
  					transform: 'rotate(-2deg)'
  				},
  				'50%': {
  					transform: 'rotate(2deg)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		}
  	}
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
