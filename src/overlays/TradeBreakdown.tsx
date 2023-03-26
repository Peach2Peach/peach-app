import { View } from 'react-native'
import { HorizontalLine, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { getTradeBreakdown } from '../utils/bitcoin'
import { TradeBreakdownSats } from './TradeBreakdownSats'

type Props = {
  releaseTransaction: string
  releaseAddress: string
  amount: number
}

export const TradeBreakdown = ({ releaseTransaction, releaseAddress, amount }: Props) => {
  const { totalAmount, peachFee, networkFee, amountReceived } = getTradeBreakdown(
    releaseTransaction,
    releaseAddress,
    amount,
  )

  return (
    <View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <Text style={tw`subtitle-1 text-black-2`}>{i18n('tradeComplete.popup.tradeBreakdown.sellerAmount')}</Text>
        <TradeBreakdownSats amount={totalAmount} />
      </View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <Text style={tw`subtitle-1 text-black-2`}>{i18n('tradeComplete.popup.tradeBreakdown.peachFees')}</Text>
        <TradeBreakdownSats amount={peachFee} />
      </View>
      <HorizontalLine style={tw`self-end my-4 bg-black-2 w-45`} />

      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`subtitle-1 text-black-2`}>{i18n('tradeComplete.popup.tradeBreakdown.tradeAmount')}</Text>
        <TradeBreakdownSats amount={totalAmount - peachFee} />
      </View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <Text style={tw`subtitle-1 text-black-2`}>{i18n('tradeComplete.popup.tradeBreakdown.networkFees')}</Text>
        <TradeBreakdownSats amount={networkFee} />
      </View>
      <HorizontalLine style={tw`self-end my-4 bg-black-2 w-45`} />
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`subtitle-1 text-black-2`}>{i18n('tradeComplete.popup.tradeBreakdown.youGet')}</Text>
        <TradeBreakdownSats amount={amountReceived} />
      </View>
    </View>
  )
}
