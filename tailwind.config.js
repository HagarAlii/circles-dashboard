/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], 
  theme: {
    extend: {
      colors: {
        main: 'var(--color-main)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        inputsBg: 'var(--color-inputsBg)',
        dark: 'var(--color-dark)',
        darker: 'var(--color-darker)',
        text: 'var(--color-text)',
        glass: 'var(--color-glass)',
        light: 'var(--color-light)',
      },
     boxShadow: {
        'inset-black-2xs': 'inset 0 1px 2px rgba(0, 0, 0, 0.5)', // very small inset black shadow
      },
  
      borderRadius: {
        pill: 'var(--rounded-pill)',
        rounded: 'var(--rounded-rounded)',
        largeRounded: 'var(--rounded-largeRounded)',
      },
      boxShadow: {
        main: 'var(--shadow-main)',
        softPrimary: 'var(--shadow-softPrimary)',
        btnPrimary: 'var(--shadow-btnPrimary)',
        btnPrimaryHover: 'var(--shadow-btnPrimaryHover)',
        btnSecondaryHover: 'var(--shadow-btnSecondaryHover)',
        card: 'var(--shadow-card)',
        glassCard: 'var(--shadow-glassCard)',
      },
      animation: {
        'fade-slide-in': 'fade-slide-in-from-top 0.3s ease-out forwards',
      },
      keyframes: {
        'fade-slide-in-from-top': {
          '0%': { opacity: 0, transform: 'translateY(-50px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
  function ({ addUtilities }) {
    addUtilities({
      '.text-shadow-soft': {
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      },
    });
  },
]
};
