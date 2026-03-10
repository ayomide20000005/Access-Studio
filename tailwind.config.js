/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#4F46E5',
        dark: '#121212',
        surface: '#1A1A1A',
        panel: '#242424',
        border: '#2E2E2E',
        text: '#F5F5F5',
        muted: '#888888',
        'light-bg': '#F5F5F5',
        'light-surface': '#FFFFFF',
        'light-panel': '#F0F0F0',
        'light-border': '#E0E0E0',
        'light-text': '#121212',
        'light-muted': '#666666',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}