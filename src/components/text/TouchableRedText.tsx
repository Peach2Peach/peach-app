import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import { Icon, Text } from '..'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'

type Props = {
  style?: StyleProp<ViewStyle>
  children: string
  iconId: IconType
  onPress: () => void
}
export function TouchableRedText ({ style, children, iconId, onPress }: Props) {
  return (
    <TouchableOpacity style={[tw`flex-row items-center gap-4`, style]} onPress={onPress}>
      <Text style={tw`subtitle-1 text-error-main`}>{children}</Text>
      <Icon id={iconId} color={tw`text-error-main`.color} size={16} />
    </TouchableOpacity>
  )
}
