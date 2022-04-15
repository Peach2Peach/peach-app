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
          2: '#DB6C39',
          translucent: '#F57940BB',
          'translucent-2': '#F57940FA',
        },
        chat: {
          you: '#40BCF5',
          partner: '#888888',
          mediator: '#F57940',
          'you-translucent': '#40BCF519',
          'partner-translucent': '#88888819',
          'mediator-translucent': '#F5794019',
          'error-translucent': '#E43B5FA0',
        },
        green: '#0AE557',
        red: '#E43B5F',
        yellow: {
          1: '#F5D440',
          2: '#edc40c',
        },
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
        'lg': '1.125rem',
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
      },
      width: {
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',
        '8/8': '100%',
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
