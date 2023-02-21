import { ColorStop } from '../../components/RadialGradient'
import tw from '../../styles/tailwind'

export const whiteGradient: ColorStop[] = [
  { offset: '0%', color: '#FCFCFD', opacity: '1' },
  { offset: '100%', color: '#FCFCFD', opacity: '0' },
]

export const primaryGradient: ColorStop[] = [
  { offset: '0%', color: String(tw`text-gradient-yellow`.color), opacity: '1' },
  { offset: '50.25%', color: String(tw`text-gradient-orange`.color), opacity: '1' },
  { offset: '100%', color: String(tw`text-gradient-red`.color), opacity: '1' },
]

export const peachyGradient: ColorStop[] = [
  { offset: '0%', color: String(tw`text-gradient-yellow`.color), opacity: '1' },
  { offset: '50.25%', color: String(tw`text-gradient-orange`.color), opacity: '1' },
  { offset: '100%', color: String(tw`text-gradient-red`.color), opacity: '1' },
]
