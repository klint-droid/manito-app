/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070b1e',
          900: '#0c1330',
          800: '#141e46',
          700: '#1f2d63',
        },
        ice: {
          200: '#d8f3ff',
          300: '#a8e4ff',
          400: '#72d2ff',
        },
        pastel: {
          pink: '#ff9ec7',
          purple: '#b993ff',
          mint: '#88f2cb',
          gold: '#ffd56b',
        },
      },
      fontFamily: {
        display: ['"Fredoka"', '"Nunito"', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['"Nunito"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 28px rgba(168, 228, 255, 0.28)',
        gold: '0 0 32px rgba(255, 213, 107, 0.45)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
