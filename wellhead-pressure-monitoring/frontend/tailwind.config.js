/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#121212',
        card: '#1e1e1e',
        primary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        critical: '#ef4444',
        fault: '#8b5cf6',
      }
    },
  },
  plugins: [],
}
