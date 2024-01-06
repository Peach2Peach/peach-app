import { create, plugin } from 'twrnc'
import config from '../../tailwind.config.js'

const tw = create({
  ...config,
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        h1: 'font-baloo-bold text-6xl leading-6xl tracking-tightest',
        h2: 'font-baloo-bold text-5xl leading-5xl tracking-tighter',
        h3: 'font-baloo-bold text-4xl leading-5xl tracking-tight',
        h4: 'font-baloo-bold text-3xl leading-3xl tracking-normal',
        h5: 'font-baloo-bold text-2xl leading-2xl tracking-normal',
        h6: 'font-baloo-bold text-xl leading-2xl tracking-normal',
        h7: 'font-baloo-bold text-base leading-lg tracking-normal',
        'drawer-title': 'font-baloo-bold text-base leading-relaxed tracking-widest uppercase',
        'subtitle-0': 'font-baloo-semibold text-xl tracking-normal',
        'subtitle-1': 'font-baloo-semibold text-base leading-xl tracking-normal',
        'subtitle-2': 'font-baloo-semibold text-xs leading-sm tracking-normal',
        'body-l': 'font-baloo text-xl leading-xl tracking-normal',
        'body-m': 'font-baloo text-base leading-base tracking-normal',
        'body-s': 'font-baloo text-xs leading-xs tracking-normal',
        'button-large': 'font-baloo-semibold text-sm leading-lg tracking-wider uppercase',
        'button-medium': 'font-baloo-semibold text-xs leading-base tracking-wider uppercase',
        'button-small': 'font-baloo-semibold text-2xs leading-sm tracking-wider uppercase',
        settings: 'font-baloo-semibold text-xl lowercase leading-2xl tracking-normal',
        'input-label': 'font-baloo-bold text-base leading-xs tracking-normal',
        'input-text': 'font-baloo text-lg leading-relaxed tracking-normal',
        'input-title': 'font-baloo text-base tracking-normal font-bold leading-23px',
        tooltip: 'font-baloo-medium text-xs leading-xs tracking-normal',
        notification: 'font-baloo-semibold text-3xs tracking-superTightest leading-sm text-center',
      })
    }),
  ],
})
export default tw
