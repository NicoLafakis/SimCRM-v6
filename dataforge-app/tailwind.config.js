/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Blue color for primary elements
        'background-light': '#F9FAFB',
        'background-dark': '#111827',
        'content-light': '#FFFFFF',
        'content-dark': '#1F2937',
        'border-light': '#E5E7EB',
        'border-dark': '#374151',
        'text-primary-light': '#111827',
        'text-primary-dark': '#F9FAFB',
        'text-secondary-light': '#6B7280',
        'text-secondary-dark': '#9CA3AF',
      },
      fontFamily: {
        'display': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
