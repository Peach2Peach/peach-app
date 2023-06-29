import { useIsMediumScreen } from '../../hooks'
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
  const isMediumScreen = useIsMediumScreen()
  const color = getBackgroundColor(props)
  const textColor = getTextColor(props)
  const borderColor = getBorderColor(props)
  const iconColor = getIconColor(props)
  const iconSize = props.iconSize || isMediumScreen ? 16 : 12

  return <BubbleBase {...{ ...props, color, textColor, iconColor, iconSize, borderColor }} />
}
