import React from 'react'
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native'
import { Style } from 'twrnc/dist/esm/types'
import tw from '../../styles/tailwind'
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
  color?: Style | undefined
  textColor: Style
  borderColor?: Style | undefined
  style?: StyleProp<ViewStyle>
} & PressableProps

export const Button = ({ wide, children, iconId, narrow, color, textColor, borderColor, ...props }: ButtonProps) => {
  const width = iconId && !children ? tw`w-12` : wide ? tw`w-57` : narrow ? tw`w-39` : undefined
  const iconSize = !children ? tw`w-6 h-6` : tw`w-4 h-4`
  const borderRadius = !!iconId && !children ? tw`rounded-[16px]` : tw`rounded-full`

  return (
    <Pressable
      {...props}
      style={[
        color,
        width,
        tw`flex-row items-center justify-center h-10 px-4`,
        borderRadius,
        borderColor && [tw`border-2`, borderColor],
        props.style,
      ]}
    >
      {children && <Text style={[textColor, tw`button-medium px-2`]}>{children}</Text>}
      {!!iconId && (
        <Icon id={iconId} style={iconSize} color={typeof textColor.color === 'string' ? textColor.color : undefined} />
      )}
    </Pressable>
  )
}
