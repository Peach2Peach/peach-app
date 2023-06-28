import { BubbleBase, BubbleBaseProps } from './BubbleBase'
import { getBackgroundColor } from './helpers/getBackgroundColor'
import { getBorderColor } from './helpers/getBorderColor'
import { getIconColor } from './helpers/getIconColor'
import { getTextColor } from './helpers/getTextColor'

export type BubbleProps = Partial<BubbleBaseProps> & {
  color: 'primary' | 'primary-mild' | 'black' | 'gray'
  ghost?: boolean
}

export const Bubble = (props: BubbleProps) => {
  const color = getBackgroundColor(props)
  const textColor = getTextColor(props)
  const borderColor = getBorderColor(props)
  const iconColor = props.iconColor || getIconColor(props)

  return <BubbleBase {...{ ...props, color, textColor, iconColor, borderColor }} />
}
