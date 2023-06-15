import { View, ViewStyle } from 'react-native'
import { FillProps } from 'react-native-svg'
import { IconType } from '../../assets/icons'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'

type Props = ComponentProps & {
  text: string
  textStyle?: ViewStyle | ViewStyle[]
  iconId: IconType
  iconSize?: number
  iconColor?: FillProps['fill']
}
export const TradeInfo = ({ text, textStyle, iconId, iconSize = 16, iconColor, style }: Props) => (
  <View style={[tw`flex-row items-center gap-1`, style]}>
    <Text style={[tw`uppercase button-medium`, textStyle]}>{text}</Text>
    <Icon id={iconId} style={{ width: iconSize, height: iconSize }} color={iconColor} />
  </View>
)
