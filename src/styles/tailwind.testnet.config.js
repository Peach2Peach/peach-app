const { plugin } = require('twrnc')
const defaultTheme = require('./tailwind.config')

module.exports = {
  ...defaultTheme,
  theme: {
    ...defaultTheme.theme,
    extend: {
      ...defaultTheme.theme.extend,
      colors: {
        ...defaultTheme.theme.extend.colors,
        primary: {
          dark: {
            2: '#4F910C',
            1: '#7AB924',
          },
          main: '#8AC92C',
          mild: {
            2: '#AFDA73',
            1: '#DDEFC3',
          },
          'background-dark': '#F2F9E7',
          background: '#FCFEF6',
          'background-light': '#FEFEFB',
        },
        gradient: {
          yellow: '#FFA24C',
          orange: '#AFDA73',
          red: '#DDEFC3',
        },
      },
    },
  },
}
