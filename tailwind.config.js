module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: {
        DEFAULT: '#ffffff'
      },
      green: {
        light: '#6fcf97',
        DEFAULT: '#27AE60',
        dark: '#219653',
        darker: '#1e874b'
      },
      indigo: {
        light: '#c7d2fe ',
        DEFAULT: '#a5b4fc ',
        dark: '#6366f1 ',
        darker: '##3730a3 '
      },
      gray: {
        light: '#e2e8f0',
        DEFAULT: '#06b6d4 ',
        dark: '#0891b2 ',
        darker: '#164e63 '
      },
      cyan: {
        light: '#cffafe ',
        DEFAULT: '#cbd5e1',
        dark: '#475569',
        darker: '#334155'
      },
      blue: {
        hover: '#2563eb',
        DEFAULT: '#1d4ed8'
      },
      red: {
        light: '#FFEAEA',
        DEFAULT: '#EB5757',
        dark: '#C20D0D'
      },
      orange: {
        light: '#FFEBDA',
        DEFAULT: '#F66A0A',
        dark: '#A04100'
      },
      primary: {
        DEFAULT: '#24292E'
      },
      warning: {
        DEFAULT: '#D1711C'
      }
    },
    extend: {
      boxShadow: {
        default: '0px 10px 20px rgba(150, 150, 187, 0.1)'
      },
      fontSize: {
        '2rem': '2rem'
      },
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)'
      },
      gridTemplateRows: {
        // Simple 8 row grid
        8: 'repeat(8, minmax(0, 1fr))',

        // Complex site-specific row configuration
        layout: '200px minmax(900px, 1fr) 100px'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
