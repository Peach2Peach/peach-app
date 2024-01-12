import tw from '../../../styles/tailwind'
import { BubbleProps } from '../Bubble'

export const getTextColor = ({ color, ghost }: Pick<BubbleProps, 'color' | 'ghost'>) => {
  if (color === 'primary') return ghost ? tw`text-primary-main` : tw`text-primary-background-light`
  if (color === 'primary-mild') return tw`text-black-100`
  if (color === 'gray') return tw`text-black-50`

  return tw`text-black-100`
}
