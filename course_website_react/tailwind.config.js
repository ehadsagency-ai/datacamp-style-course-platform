/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'data-deep': '#1E3A8A',
        'data-moss': '#3B82F6',
        'data-light': '#60A5FA',
        'data-tender': '#93C5FD',
        'code-dark': '#374151',
        'code-light': '#6B7280',
        'chart-beige': '#F5F5DC',
        'bg-cream': '#FFFEF7',
      },
    },
  },
  plugins: [],
}
