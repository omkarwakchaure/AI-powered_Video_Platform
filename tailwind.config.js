export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        highlight: 'var(--color-highlight)',
        text: 'var(--color-text)',
        border: 'var(--color-border)',
        background: 'var(--color-background)',
        plain: 'var(--color-plain)',
        alert: 'var(--color-alert)',
        black: 'var(--color-black)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
