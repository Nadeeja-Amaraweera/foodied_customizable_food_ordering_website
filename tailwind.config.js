/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          hover: '#E85924',
          light: '#FFF0EA',
          50: '#FFF5F0',
          100: '#FFEADF',
          500: '#FF6B35',
          600: '#F05820',
          700: '#D9430E',
        },
        secondary: {
          DEFAULT: '#F7931E',
          hover: '#E08011',
          light: '#FEF4E8',
        },
        accent: {
          DEFAULT: '#2EC4B6',
          hover: '#25A99D',
          light: '#E6FAF8',
        },
        admin: {
          dark: '#1A1A2E',
          darkNavy: '#16213E',
          darkCard: '#1F243E',
          light: '#FFF8F0',
          pageBg: '#F8F9FC',
          card: '#FFFFFF',
          border: '#E8EDF5',
          textDark: '#2D2D2D',
          textMuted: '#6B7280',
          success: '#06D6A0',
          warning: '#FFB703',
          danger: '#EF476F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(26, 26, 46, 0.06), 0 1px 4px -1px rgba(26, 26, 46, 0.04)',
        'soft': '0 4px 20px -2px rgba(26, 26, 46, 0.07), 0 2px 6px -1px rgba(26, 26, 46, 0.04)',
        'soft-lg': '0 10px 30px -5px rgba(26, 26, 46, 0.1), 0 4px 12px -2px rgba(26, 26, 46, 0.06)',
        'glow-primary': '0 4px 20px -2px rgba(255, 107, 53, 0.35)',
        'glow-teal': '0 4px 20px -2px rgba(46, 196, 182, 0.35)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '16px',
        '3xl': '20px',
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
