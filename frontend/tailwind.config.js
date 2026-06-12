/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#111827',
          surface: '#1F2937',
          accent: '#D97706',
          highlight: '#F59E0B',
          bg: '#FAFAF9',
          card: '#FFFFFF',
          muted: '#6B7280',
          border: '#E7E5E4',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
