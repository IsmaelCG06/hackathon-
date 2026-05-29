import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        body: '#f0f6ff',
        primary: {
          DEFAULT: '#1e3a8a',
          dark: '#0f2044',
        },
        secondary: '#fbbf24',
        accent: '#f59e0b',
        surface: '#ffffff',
        tag: {
          blue: { bg: '#dbeafe', fg: '#1e3a8a' },
          green: { bg: '#fef9c3', fg: '#92400e' },
          purple: { bg: '#ede9fe', fg: '#4c1d95' },
          urgency: { bg: '#fef2f2', fg: '#dc2626' },
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px -6px rgba(30, 58, 138, 0.14)',
        'card-hover': '0 12px 32px -8px rgba(30, 58, 138, 0.28)',
        'accent-glow': '0 4px 20px -4px rgba(245, 158, 11, 0.4)',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        shine: 'shine 2.2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
