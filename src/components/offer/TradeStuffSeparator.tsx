import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { HorizontalLine } from '../ui'
import { Text } from '../text'
import i18n from '../../utils/i18n'

type Props = {
  disputeActive: boolean
} & ComponentProps

export const TradeStuffSeparator = ({ disputeActive, style }: Props) => (
  <View style={[tw`flex-row items-center`, style]}>
    <Text style={disputeActive ? tw`text-error-main` : tw`text-black-2`}>{i18n('trade.tradeStuff')}</Text>
    <HorizontalLine style={[tw`flex-grow ml-2`, disputeActive && tw`bg-error-mild`]} />
  </View>
)
