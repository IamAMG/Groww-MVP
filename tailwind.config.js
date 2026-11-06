/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f766e',       // teal/green primary action
        'primary-hover': '#0d5c63',
        surface: '#f8fafc',       // very light grey background
        card: '#ffffff',
        border: '#e2e8f0',
        text: '#1e293b',          // dark grey/black text
        muted: '#64748b',
      },
      borderRadius: {
        card: '12px',
        button: '10px',
      },
    },
  },
  plugins: [],
}
