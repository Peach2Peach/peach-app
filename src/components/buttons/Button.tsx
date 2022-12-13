import React from 'react'
import { StyleProp, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { Loading } from '../animation'
import Icon from '../Icon'
import { IconType } from '../icons'
import { Text } from '../text'

export type ButtonProps = {
  wide?: true
  narrow?: true
  option?: boolean
  children?: React.ReactNode
  noBackground?: true
  iconId?: IconType
  color?: ViewStyle | undefined
  textColor: TextStyle
  borderColor?: ViewStyle | undefined
  style?: StyleProp<ViewStyle>
  loading?: boolean
} & TouchableOpacityProps

export const Button = (props: ButtonProps) => {
  const { wide, children, iconId, narrow, color, textColor, borderColor, loading, ...pressableProps } = props
  const width = iconId && !children ? tw`w-14` : wide ? tw`w-57` : narrow ? tw`w-39` : undefined
  const iconSize = !children ? tw`w-6 h-6` : tw`w-4 h-4`
  const borderRadius = !!iconId && !children ? tw`rounded-[12px]` : tw`rounded-full`

  return (
    <TouchableOpacity
      {...pressableProps}
      style={[
        color,
        width,
        tw`flex-row items-center justify-center h-10 px-4`,
        borderRadius,
        borderColor && [tw`border-2`, borderColor],
        pressableProps.style,
      ]}
    >
      {children && <Text style={[textColor, tw`button-medium px-2`]}>{children}</Text>}
      {loading ? (
        <Loading style={iconSize} color={textColor?.color} />
      ) : (
        !!iconId && <Icon id={iconId} style={iconSize} color={textColor?.color} />
      )}
    </TouchableOpacity>
  )
}
