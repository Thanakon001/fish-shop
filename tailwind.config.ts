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
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E'
        },
        accent: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        skyLight: {
          'primary': '#0EA5E9',
          'primary-content': '#FFFFFF',
          'secondary': '#38BDF8',
          'secondary-content': '#FFFFFF',
          'accent': '#06B6D4',
          'accent-content': '#FFFFFF',
          'neutral': '#1E293B',
          'neutral-content': '#F8FAFC',
          'base-100': '#FFFFFF',
          'base-200': '#F0F9FF',
          'base-300': '#E0F2FE',
          'base-content': '#0F172A',
          'info': '#0EA5E9',
          'success': '#22C55E',
          'warning': '#F59E0B',
          'error': '#EF4444'
        }
      }
    ],
    darkTheme: false
  }
} satisfies Config


