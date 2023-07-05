import { ReactNode } from 'react'
import { StyleProp, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'

export type BubbleBaseProps = {
  option?: boolean
  children?: ReactNode
  iconId?: IconType
  iconColor?: TextStyle
  iconSize?: number
  borderRadius?: ViewStyle
  color?: ViewStyle
  textColor: TextStyle
  borderColor?: ViewStyle
  style?: StyleProp<ViewStyle>
} & TouchableOpacityProps

export const BubbleBase = ({
  children,
  iconId,
  color,
  textColor,
  iconColor = textColor,
  borderColor,
  iconSize = 20,
  borderRadius = tw`rounded-lg`,
  ...pressableProps
}: BubbleBaseProps) => (
  <TouchableOpacity
    {...pressableProps}
    disabled={!pressableProps.onPress}
    style={[
      color,
      tw`flex-row items-center justify-center h-7 px-2 gap-1`,
      tw.md`px-[10px]`,
      borderRadius,
      borderColor && [tw`border`, borderColor],
      pressableProps.style,
    ]}
  >
    {children && (
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[textColor, tw`text-center button-medium`, tw.md`button-large`]}
      >
        {children}
      </Text>
    )}
    {!!iconId && <Icon id={iconId} size={iconSize} color={iconColor?.color} />}
  </TouchableOpacity>
)
