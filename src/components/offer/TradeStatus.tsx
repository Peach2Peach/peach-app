import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { Text } from '../text'
import { HorizontalLine } from '../ui'
import Icon from '../Icon'
import i18n from '../../utils/i18n'

type Props = ComponentProps & {
  disputeActive: boolean
}

export const TradeStatus = ({ style, disputeActive }: Props) => (
  <View style={[tw`flex-row items-center`, style]}>
    {disputeActive && <Icon id={'alertOctagon'} style={tw`w-4 h-4 mr-1`} color={tw`text-error-main`.color} />}
    <Text style={[tw`mr-1 text-black-2`, disputeActive && tw`text-error-main`]}>
      {i18n(disputeActive ? 'trade.disputeActive' : 'trade.paymentDetails')}
    </Text>
    <HorizontalLine style={[tw`flex-grow ml-1`, disputeActive && tw`bg-error-mild`]} />
  </View>
)
