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
        black: {
          1: '#000',
          2: '#16161D'
        },
        grey: {
          1: '#5B5B5B',
          2: '#888888',
          3: '#B8B8B8',
          4: '#EBEBEB'
        },
        white: {
          1: '#FCFCFD',
          2: '#FFF'
        },
        peach: {
          1: '#F57940',
          2: '#db6c39'
        },
        green: '#0AE557',
        red: '#E43B5F',
        yellow: '#F5D440',
        blue: '#40BCF5'
      },
      fontSize: {
        '2xs': '10px',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem'
      },
      lineHeight: {
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '2.25rem',
        '4xl': '2.5rem',
        '5xl': '3.25rem',
        '6xl': '4rem',
        '7xl': '5rem',
        '8xl': '7rem',
        '9xl': '9rem'
      },
      minHeight: {
        '10': '40px'
      }
    },
    fontFamily: {
      baloo: [
        '"Baloo"',
        'sans-serif'
      ],
      lato: [
        '"Lato"',
        'sans-serif'
      ],
      mono: ['Monospace']
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
