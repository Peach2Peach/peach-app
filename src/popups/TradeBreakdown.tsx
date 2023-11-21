import { View } from 'react-native'
import { HorizontalLine, Text } from '../components'
import { BTCAmount } from '../components/bitcoin'
import tw from '../styles/tailwind'
import { getTradeBreakdown } from '../utils/bitcoin'
import i18n from '../utils/i18n'

type Props = Pick<Contract, 'releaseTransaction' | 'releaseAddress' | 'amount'>

export const TradeBreakdown = ({ releaseTransaction, releaseAddress, amount }: Props) => {
  const { totalAmount, peachFee, networkFee, amountReceived } = getTradeBreakdown({
    releaseTransaction,
    releaseAddress,
    inputAmount: amount,
  })

  return (
    <View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <Text style={tw`subtitle-1 text-black-2 shrink`}>{i18n('tradeComplete.popup.tradeBreakdown.sellerAmount')}</Text>
        <BTCAmount amount={amount} size="x small" />
      </View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <Text style={tw`subtitle-1 text-black-2 shrink`}>{i18n('tradeComplete.popup.tradeBreakdown.peachFees')}</Text>
        <BTCAmount amount={peachFee} size="x small" />
      </View>
      <HorizontalLine style={tw`self-end my-4 bg-black-2 w-45`} />

      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`subtitle-1 text-black-2 shrink`}>{i18n('tradeComplete.popup.tradeBreakdown.tradeAmount')}</Text>
        <BTCAmount amount={totalAmount - peachFee} size="x small" />
      </View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <Text style={tw`subtitle-1 text-black-2 shrink`}>{i18n('tradeComplete.popup.tradeBreakdown.networkFees')}</Text>
        <BTCAmount amount={networkFee} size="x small" />
      </View>
      <HorizontalLine style={tw`self-end my-4 bg-black-2 w-45`} />
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`subtitle-1 text-black-2 shrink`}>{i18n('tradeComplete.popup.tradeBreakdown.youGet')}</Text>
        <BTCAmount amount={amountReceived} size="x small" />
      </View>
    </View>
  )
}
