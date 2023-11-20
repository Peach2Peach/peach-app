import { ColorStop } from '../../components/PeachyGradient'
import tw from '../../styles/tailwind'

export const peachyGradient: ColorStop[] = [
  { offset: '0%', color: String(tw`text-gradient-yellow`.color), opacity: '1' },
  { offset: '50.25%', color: String(tw`text-gradient-orange`.color), opacity: '1' },
  { offset: '100%', color: String(tw`text-gradient-red`.color), opacity: '1' },
]
