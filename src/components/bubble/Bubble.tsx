import { ReactNode } from 'react'
import { StyleProp, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'

export type BubbleProps = {
  option?: boolean
  children?: ReactNode
  noBackground?: true
  iconId?: IconType
  color?: ViewStyle
  textColor: TextStyle
  borderColor?: ViewStyle
  style?: StyleProp<ViewStyle>
} & TouchableOpacityProps

export const Bubble = (props: BubbleProps) => {
  const { children, iconId, color, textColor, borderColor, ...pressableProps } = props
  const iconSize = tw`w-4 h-4`
  const borderRadius = tw`rounded-lg`

  return (
    <TouchableOpacity
      {...pressableProps}
      style={[
        color,
        tw`flex-row items-center justify-center h-7 px-[10px] gap-1`,
        borderRadius,
        borderColor && [tw`border`, borderColor],
        pressableProps.style,
      ]}
    >
      {children && (
        <Text numberOfLines={1} ellipsizeMode="tail" style={[textColor, tw`text-center button-medium`]}>
          {children}
        </Text>
      )}
      {!!iconId && <Icon id={iconId} style={iconSize} color={textColor?.color} />}
    </TouchableOpacity>
  )
}
