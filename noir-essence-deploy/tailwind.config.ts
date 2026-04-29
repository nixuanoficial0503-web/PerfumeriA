import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0d0c0a',
        smoke: '#1e1c18',
        paper: '#f5f2ec',
        cream: '#ede9e1',
        muted: '#6b6760',
        gold: {
          DEFAULT: '#b89a5a',
          light: '#d4b87a',
          dark: '#8a7240',
        },
        success: '#6abf69',
        error: '#e57373',
        info: '#7ab0e8',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xxs': '0.625rem', // 10px
        'xxxs': '0.5625rem', // 9px
      },
      letterSpacing: {
        'widest2': '0.2em',
        'widest3': '0.3em',
      },
      borderColor: {
        DEFAULT: 'rgba(184, 154, 90, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-in': 'slideIn 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
