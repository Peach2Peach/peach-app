import { View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../text'

type Props = ComponentProps & {
  text: string
  textStyle?: ViewStyle | ViewStyle[]
  IconComponent?: JSX.Element
}
export const TradeInfo = ({ text, textStyle, IconComponent, style }: Props) => (
  <View style={[tw`flex-row items-center gap-1`, style]}>
    <Text style={[tw`uppercase button-medium`, textStyle]}>{text}</Text>
    {IconComponent}
  </View>
)
