import { View } from 'react-native'
import { Text } from '../text'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { IconType } from '../../assets/icons'
import { FillProps } from 'react-native-svg'

type Props = {
  text: string
  iconId: IconType
  iconColor?: FillProps['fill']
}
export const TradeInfo = ({ text, iconId, iconColor }: Props) => (
  <View style={tw`flex-row items-center gap-1`}>
    <Text style={tw`uppercase button-medium`}>{text}</Text>
    <Icon id={iconId} style={tw`w-4 h-4`} color={iconColor} />
  </View>
)
