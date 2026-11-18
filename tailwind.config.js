/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Variable"', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FFF9F0',
        ink: {
          DEFAULT: '#1E1B2E',
          soft: '#4B4763',
        },
        night: {
          DEFAULT: '#12111A',
          card: '#1C1B27',
          line: '#2E2C3D',
        },
      },
      keyframes: {
        'node-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.45)' },
          '50%': { boxShadow: '0 0 0 14px rgba(16, 185, 129, 0)' },
        },
        'bob': {
          '0%, 100%': { transform: 'translate(-50%, 0)' },
          '50%': { transform: 'translate(-50%, -6px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
      },
      animation: {
        'node-pulse': 'node-pulse 2s ease-in-out infinite',
        'bob': 'bob 1.6s ease-in-out infinite',
        'wiggle': 'wiggle 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
