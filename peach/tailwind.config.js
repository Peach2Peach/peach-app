module.exports = {
  theme: {
    extend: {
      inset: {
        px: '1px',
        '1/2': '50%'
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000',
        white: '#fff',
        orange: '#f68e52',
      },
      fontSize: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem'
      }
    },
    fontFamily: {
      sans: [
        '"Helvetica Neue"',
        'Helvetica',
        'sans-serif'
      ],
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    }
  },
  variants: {},
  corePlugins: {},
  plugins: []
}
