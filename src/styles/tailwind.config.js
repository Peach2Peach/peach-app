const { plugin } = require("twrnc");

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
          1: '#2B1911',
          2: '#3E2C25',
          3: '#5C4539',
          4: '#9F8C82',
          5: '#BAADA7',
          6: '#D4CECB',
          7: '#ECECEC',
        },
        primary: {
          dark: '#963600',
          main: '#C45104',
          light: '#F56522',
          'mild-2': '#FCCCB6',
          background: '#FFF9F6',
          'background-light': '#FFFCFA',
        },
        success: {
          dark: '#016736',
          main: '#008847',
          light: '#05A85A',
          background: '#C9FFE5',
        },
        warning: {
          dark: '#917201',
          main: '#B6900B',
          light: '#EAB703',
          background: '#FFF1CA',
        },
        error: {
          dark: '#B01807',
          main: '#DF321F',
          light: '#FE5A48',
          background: '#FFD2CC',
        },
        info: {
          dark: '#005E89',
          main: '#037DB5',
          light: '#099DE2',
          background: '#D7F2FE',
          'background-light': 'rgba(215, 242, 254, 0.1)',
        }
      },
      fontSize: {
        '6xl': '96px',
        '5xl': '60px',
        '4xl': '48px',
        '3xl': '34px',
        '2xl': '24px',
        'xl': '20px',
        'lg': '18px',
        'base': '16px',
        'sm': '15px',
        'xs': '14px',
        '2xs': '13px',
        '3xs': '12px',
      },
      lineHeight: {
        '6xl': '112px',
        '5xl': '72px',
        '4xl': '56px',
        '3xl': '42px',
        '2xl': '32px',
        'xl': '28px',
        'lg': '26px',
        'base': '24px',
        'sm': '22px',
        'xs': '20px',
      },
      letterSpacing: {
        tighter: '-1.5px',
        tight: '0px',
        normal: '0.15px',
        wide: '0.25px',
        wider: '0.5px',
        widest: '1px',
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
        'Baloo2-Regular',
        'Baloo2-Bold',
        'Baloo2-SemiBold',
        'Baloo2-Medium',
        'sans-serif'
      ]
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
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        'h1': `font-baloo-bold font-bold text-6xl leading-6xl tracking-tigther`,
        'h2': `font-baloo-bold font-bold text-5xl leading-5xl tracking-wider`,
        'h3': `font-baloo-bold font-bold text-4xl leading-4xl tracking-tight`,
        'h4': `font-baloo-bold font-bold text-3xl leading-3xl tracking-wide`,
        'h5': `font-baloo-bold font-bold text-2xl leading-2xl tracking-tight`,
        'h6': `font-baloo-bold font-bold text-xl leading-2xl tracking-normal`,
        'subtitle-1': `font-baloo-semibold font-semibold text-base leading-xl tracking-normal`,
        'subtitle-2': `font-baloo-semibold font-semibold text-xs leading-sm tracking-normal`,
        'body-1': `font-baloo text-base leading-base tracking-normal`,
        'body-2': `font-baloo text-xs leading-xs tracking-normal`,
        'button-large': `font-baloo-semibold font-semibold text-sm leading-lg tracking-wider uppercase`,
        'button-medium': `font-baloo-semibold font-semibold text-xs leading-base tracking-wider uppercase`,
        'button-small': `font-baloo-semibold font-semibold text-2xs leading-sm tracking-wider uppercase`,
        'caption': `font-baloo text-xs leading-xs tracking-normal`,
        'overline': `font-baloo text-xs leading-xs tracking-widest`,
        'avatar': `font-baloo text-xs leading-xs tracking-normal`,
        'input-label': `font-baloo text-xs leading-xs tracking-normal`,
        'input-text': `font-baloo text-lg leading-sm tracking-normal`,
        'helper-text': `font-baloo text-xs leading-xs tracking-normal`,
        'tooltip': `font-baloo-medium font-medium text-xs leading-xs tracking-normal`,
      });
    }),
  ]}
