import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { IconType } from '../../assets/icons'
import { useIsMediumScreen } from '../../hooks/useIsMediumScreen'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { PeachText } from '../text/PeachText'
import { BubbleBase, BubbleBaseProps } from './BubbleBase'
import { getBackgroundColor } from './helpers/getBackgroundColor'
import { getBorderColor } from './helpers/getBorderColor'
import { getIconColor } from './helpers/getIconColor'
import { getTextColor } from './helpers/getTextColor'

export type BubbleProps = Partial<BubbleBaseProps> & {
  color: 'primary' | 'primary-mild' | 'black' | 'gray'
  ghost?: boolean
}

/**
 * @deprecated use NewBubble instead
 */
export const Bubble = (props: BubbleProps) => {
  const isMediumScreen = useIsMediumScreen()
  const color = getBackgroundColor(props)
  const textColor = getTextColor(props)
  const borderColor = getBorderColor(props)
  const iconColor = props.iconColor || getIconColor(props)
  const iconSize = props.iconSize || isMediumScreen ? 16 : 12

  return <BubbleBase {...{ ...props, color, textColor, iconColor, iconSize, borderColor }} />
}

export type NewBubbleProps = {
  children: React.ReactNode
  iconId?: IconType
  color: 'orange' | 'black' | 'gray' | 'primary-mild' | 'green'
  ghost?: boolean
} & TouchableOpacityProps

export function NewBubble ({ children, iconId, color, ghost, ...touchableOpacityProps }: NewBubbleProps) {
  const colorStyle = tw.color(
    color === 'orange'
      ? 'primary-main'
      : color === 'primary-mild'
        ? 'primary-mild-1'
        : color === 'green'
          ? 'success-main'
          : color === 'gray'
            ? 'black-50'
            : 'black-100',
  )

  return (
    <TouchableOpacity
      style={[
        tw`flex-row items-center justify-center gap-1 px-2 rounded-lg py-2px`,
        [tw`border`, { borderColor: colorStyle }],
        ghost ? tw`bg-transparent` : { backgroundColor: colorStyle },
      ]}
      {...touchableOpacityProps}
    >
      <PeachText
        style={[tw`text-center button-medium`, { color: ghost ? colorStyle : tw.color('primary-background-light') }]}
      >
        {children}
      </PeachText>
      {!!iconId && <Icon id={iconId} size={12} color={ghost ? colorStyle : tw.color('primary-background-light')} />}
    </TouchableOpacity>
  )
}
