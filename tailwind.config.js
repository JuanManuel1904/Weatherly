/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          900: '#060D1A',
          800: '#0B1426',
          700: '#111D35',
          600: '#1A2A47',
        },
        ocean: {
          600: '#1E3A5F',
          500: '#2B5090',
          400: '#3A6BB8',
        },
        cyan: {
          glow: '#00D4FF',
          soft: '#7FE8FF',
          pale: '#C5F4FF',
        },
        slate: {
          fog: '#4A6FA5',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backgroundImage: {
        'day-gradient': 'linear-gradient(135deg, #0B1F3A 0%, #1E3A5F 40%, #2B5090 70%, #1A3255 100%)',
        'night-gradient': 'linear-gradient(135deg, #060D1A 0%, #0B1426 50%, #111D35 100%)',
      }
    },
  },
  plugins: [],
}
