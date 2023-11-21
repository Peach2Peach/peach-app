import { ReactNode } from 'react'
import { TextStyle, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { IconType } from '../../assets/icons'
import { useIsMediumScreen } from '../../hooks'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { Loading } from '../animation'
import { Text } from '../text'

export type ButtonProps = {
  iconId?: IconType
  ghost?: boolean
  textColor?: TextStyle
  children: ReactNode
  loading?: boolean
} & TouchableOpacityProps

export const Button = ({
  iconId,
  ghost,
  textColor = tw`text-primary-background-light`,
  children,
  loading,
  ...touchableOpacityProps
}: ButtonProps) => {
  const isMediumScreen = useIsMediumScreen()

  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      disabled={touchableOpacityProps.disabled || loading}
      style={[
        tw`bg-primary-main min-w-26`,
        tw.md`min-w-32`,
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

      {loading ? (
        <Loading style={[tw`h-14px w-14px`, tw.md`h-18px w-18px`]} color={textColor?.color} />
      ) : (
        !!iconId && <Icon id={iconId} size={isMediumScreen ? 18 : 14} color={textColor?.color} />
      )}
    </TouchableOpacity>
  )
}
