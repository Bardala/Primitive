/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['selector', '.dark-mode'], // Respect existing theme toggle
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        background: {
          light: '#f8fafc', // slate-50
          dark: '#020617', // slate-950
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a', // slate-900
        },
        text: {
          primary: {
            light: '#1e293b', // slate-800
            dark: '#e2e8f0', // slate-200
          },
          secondary: {
            light: '#64748b', // slate-500
            dark: '#94a3b8', // slate-400
          },
        },
        border: {
          light: '#e2e8f0', // slate-200
          dark: '#1e293b', // slate-800
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'], // For reading mode
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)',
        glow: '0 0 15px rgba(13, 148, 136, 0.3)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
