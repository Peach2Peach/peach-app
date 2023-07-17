import { ReactNode } from 'react'
import { StyleProp, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { Loading } from '../animation'
import { Icon } from '../Icon'
import { IconType } from '../../assets/icons'
import { Text } from '../text'

export type ButtonProps = {
  wide?: true
  narrow?: boolean
  option?: boolean
  children?: ReactNode
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
  const iconSize = loading || !children ? tw`w-6 h-6` : tw`w-4 h-4`
  const borderRadius = !!iconId && !children ? tw`rounded-xl` : tw`rounded-full`

  return (
    <TouchableOpacity
      {...pressableProps}
      style={[
        color,
        width,
        tw`flex-row items-center justify-center h-8 px-4`,
        tw.md`h-10`,
        borderRadius,
        borderColor && [tw`border-2`, borderColor],
        pressableProps.style,
      ]}
    >
      {children && (
        <Text numberOfLines={1} ellipsizeMode="tail" style={[textColor, tw`px-2 text-center button-medium min-w-24`]}>
          {children}
        </Text>
      )}
      {loading ? (
        <Loading style={iconSize} color={textColor?.color} />
      ) : (
        !!iconId && <Icon id={iconId} style={iconSize} color={textColor?.color} />
      )}
    </TouchableOpacity>
  )
}
