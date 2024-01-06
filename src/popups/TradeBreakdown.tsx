import { View } from 'react-native'
import { BTCAmount } from '../components/bitcoin/btcAmount/BTCAmount'
import { PeachText } from '../components/text/PeachText'
import { HorizontalLine } from '../components/ui/HorizontalLine'
import tw from '../styles/tailwind'
import { getTradeBreakdown } from '../utils/bitcoin/getTradeBreakdown'
import i18n from '../utils/i18n'

type Props = Pick<Contract, 'releaseTransaction' | 'releaseAddress' | 'amount'>

export const TradeBreakdown = ({ releaseTransaction, releaseAddress, amount }: Props) => {
  const { totalAmount, peachFee, networkFee, amountReceived } = getTradeBreakdown({
    releaseTransaction,
    releaseAddress,
    inputAmount: amount,
  })

  const textStyle = tw`subtitle-1 text-black-65 shrink`

  return (
    <View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <PeachText style={textStyle}>{i18n('tradeComplete.popup.tradeBreakdown.sellerAmount')}</PeachText>
        <BTCAmount amount={amount} size="small" />
      </View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <PeachText style={textStyle}>{i18n('tradeComplete.popup.tradeBreakdown.peachFees')}</PeachText>
        <BTCAmount amount={peachFee} size="small" />
      </View>
      <HorizontalLine style={tw`self-end my-4 bg-black-65 w-45`} />

      <View style={tw`flex-row items-center justify-between`}>
        <PeachText style={textStyle}>{i18n('tradeComplete.popup.tradeBreakdown.tradeAmount')}</PeachText>
        <BTCAmount amount={totalAmount - peachFee} size="small" />
      </View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <PeachText style={textStyle}>{i18n('tradeComplete.popup.tradeBreakdown.networkFees')}</PeachText>
        <BTCAmount amount={networkFee} size="small" />
      </View>
      <HorizontalLine style={tw`self-end my-4 bg-black-65 w-45`} />
      <View style={tw`flex-row items-center justify-between`}>
        <PeachText style={textStyle}>{i18n('tradeComplete.popup.tradeBreakdown.youGet')}</PeachText>
        <BTCAmount amount={amountReceived} size="small" />
      </View>
    </View>
  )
}
