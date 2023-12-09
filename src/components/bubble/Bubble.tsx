import { TouchableOpacity } from 'react-native'
import { IconType } from '../../assets/icons'
import { useIsMediumScreen } from '../../hooks'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { Text } from '../text'
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
  const iconColor = props.iconColor || getIconColor(props)
  const iconSize = props.iconSize || isMediumScreen ? 16 : 12

  return <BubbleBase {...{ ...props, color, textColor, iconColor, iconSize, borderColor }} />
}

type NewBubbleProps = {
  children: string
  iconId?: IconType
  onPress?: () => void
  color: 'orange' | 'black' | 'gray'
  ghost?: boolean
}

export function NewBubble ({ children, iconId, onPress, color, ghost }: NewBubbleProps) {
  const colorStyle
    = color === 'orange' ? tw.color('primary-main') : color === 'gray' ? tw.color('black-3') : tw.color('black-1')

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`flex-row items-center justify-center gap-1 px-2 rounded-lg py-2px`,
        ghost ? [tw`bg-transparent border`, { borderColor: colorStyle }] : [{ backgroundColor: colorStyle }],
      ]}
    >
      <Text
        style={[tw`text-center button-medium`, { color: ghost ? colorStyle : tw.color('primary-background-light') }]}
      >
        {children}
      </Text>
      {!!iconId && <Icon id={iconId} size={12} color={ghost ? colorStyle : tw.color('primary-background-light')} />}
    </TouchableOpacity>
  )
}
