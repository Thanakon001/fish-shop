import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/composables/**/*.{js,ts}',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sarabun', 'sans-serif']
      },
      colors: {
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03'
        }
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        isanTheme: {
          'primary': '#F59E0B',
          'primary-content': '#451A03',
          'secondary': '#D97706',
          'secondary-content': '#FFFBEB',
          'accent': '#FBBF24',
          'accent-content': '#78350F',
          'neutral': '#1f2937',
          'neutral-content': '#f9fafb',
          'base-100': '#fffbeb',
          'base-200': '#fef3c7',
          'base-300': '#fde68a',
          'base-content': '#78350F',
          'info': '#3ABFF8',
          'success': '#36D399',
          'warning': '#FBBD23',
          'error': '#F87272'
        }
      }
    ],
    darkTheme: false
  }
} satisfies Config
