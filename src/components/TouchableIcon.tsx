import { ColorValue, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { IconType } from '../assets/icons'
import tw from '../styles/tailwind'
import { Icon } from './Icon'

type Props = {
  id: IconType
  iconColor?: ColorValue | undefined
  iconSize?: number
} & TouchableOpacityProps

const DEFAULT_ICON_SIZE = 24
export function TouchableIcon ({ id, iconColor = tw.color('primary-main'), iconSize, ...touchableProps }: Props) {
  return (
    <TouchableOpacity {...touchableProps}>
      <Icon id={id} size={iconSize ?? DEFAULT_ICON_SIZE} color={iconColor} />
    </TouchableOpacity>
  )
}
