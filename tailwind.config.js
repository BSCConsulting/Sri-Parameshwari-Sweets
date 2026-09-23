/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#FBF2F2',
          100: '#F5E0E1',
          200: '#E8BFC1',
          300: '#D4989B',
          400: '#B8555B',
          500: '#9A1A22',
          600: '#7A0C16',
          700: '#660A12',
          800: '#4D0810',
          900: '#33060A',
        },
        gold: {
          50: '#FDF8EC',
          100: '#F9EFD0',
          200: '#F3E5AB',
          300: '#E8D389',
          400: '#D4AF37',
          500: '#C59B27',
          600: '#A67C1E',
          700: '#806018',
          800: '#5A4411',
          900: '#3D2E0B',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FDF8F0',
          200: '#FBF1E2',
          300: '#F3E8D8',
          400: '#E6D5BD',
        },
        ink: {
          900: '#241915',
          700: '#3D2E26',
          500: '#6B5E59',
          300: '#A0938C',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
