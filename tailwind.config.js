module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
          default: '0px 10px 20px rgba(150, 150, 187, 0.1)',
      },
      fontSize: {
          '2rem': '2rem',
      },
  },
},
  variants: {
      extend: {},
  },
  plugins: [],
};