import tw from '../../../styles/tailwind'
import { BubbleProps } from '../Bubble'

export const getBorderColor = ({ color, ghost }: Pick<BubbleProps, 'color' | 'ghost'>) => {
  if (color === 'primary') return ghost ? tw`border-primary-main` : undefined
  if (color === 'primary-mild') return ghost ? tw`border-black-100` : tw`border-primary-mild-1`
  if (color === 'gray') return tw`border-black-50`

  return tw`border-black-100`
}
