import { ColorStop } from '../../components/RadialGradient'
import tw from '../../styles/tailwind'

export const whiteGradient: ColorStop[] = [
  { offset: '0%', color: String(tw.color('primary-background')), opacity: '1' },
  { offset: '100%', color: String(tw.color('primary-background')), opacity: '0' },
]

export const primaryGradient: ColorStop[] = [
  { offset: '0%', color: String(tw.color('gradient-yellow')), opacity: '1' },
  { offset: '50.25%', color: String(tw.color('gradient-orange')), opacity: '1' },
  { offset: '100%', color: String(tw.color('gradient-red')), opacity: '1' },
]

export const peachyGradient: ColorStop[] = [
  { offset: '0%', color: String(tw.color('gradient-yellow')), opacity: '1' },
  { offset: '50.25%', color: String(tw.color('gradient-orange')), opacity: '1' },
  { offset: '100%', color: String(tw.color('gradient-red')), opacity: '1' },
]
