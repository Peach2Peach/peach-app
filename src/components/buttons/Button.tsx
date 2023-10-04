import { ReactNode } from 'react'
import { StyleProp, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import { IconType } from '../../assets/icons'
import { useIsMediumScreen } from '../../hooks'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { Loading } from '../animation'
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

/** @deprecated Use NewButton instead */
export const Button = (props: ButtonProps) => {
  const { wide, children, iconId, narrow, color, textColor, borderColor, loading, ...pressableProps } = props
  const width = iconId && !children ? tw`w-14` : wide ? tw`w-57` : narrow ? tw`w-39` : undefined
  const iconSize = loading ? tw`w-5 h-5` : !children ? tw`w-6 h-6` : tw`w-4 h-4`
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

type Props = {
  iconId?: IconType
  ghost?: boolean
  textColor?: TextStyle
  children: ReactNode
} & TouchableOpacityProps

/** This button is intented to replace the base layer + the primary button component due to its greater simplicity */
export const NewButton = ({
  iconId,
  ghost,
  textColor = tw`text-primary-background-light`,
  children,
  ...touchableOpacityProps
}: Props) => {
  const isMediumScreen = useIsMediumScreen()

  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      style={[
        tw`bg-primary-main`,
        touchableOpacityProps.style,
        tw`flex-row items-center justify-center h-8 gap-2 px-6 rounded-full`,
        tw.md`h-10 px-8`,
        touchableOpacityProps.disabled && tw`opacity-33`,
        ghost && tw`bg-transparent border-2`,
        { borderColor: ghost ? textColor?.color : undefined },
      ]}
    >
      <Text numberOfLines={1} ellipsizeMode="tail" style={[tw`button-small`, tw.md`button-large`, textColor]}>
        {children}
      </Text>

      {!!iconId && <Icon id={iconId} size={isMediumScreen ? 18 : 14} color={textColor?.color} />}
    </TouchableOpacity>
  )
}
