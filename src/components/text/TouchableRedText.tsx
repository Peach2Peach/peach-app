import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import { Icon } from '../Icon'
import { PeachText } from './PeachText'

type Props = {
  style?: StyleProp<ViewStyle>
  children: string
  iconId: IconType
  onPress: TouchableOpacityProps['onPress']
}
export function TouchableRedText ({ style, children, iconId, onPress }: Props) {
  return (
    <TouchableOpacity style={[tw`flex-row items-center gap-4`, style]} onPress={onPress}>
      <PeachText style={tw`subtitle-1 text-error-main`}>{children}</PeachText>
      <Icon id={iconId} color={tw.color('error-main')} size={16} />
    </TouchableOpacity>
  )
}
