import { View } from 'react-native'
import { BTCAmount } from '../components/bitcoin/BTCAmount'
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

  const data = [
    [
      { text: i18n('tradeComplete.popup.tradeBreakdown.sellerAmount'), amount },
      { text: i18n('tradeComplete.popup.tradeBreakdown.peachFees'), amount: peachFee },
    ],
    [
      { text: i18n('tradeComplete.popup.tradeBreakdown.tradeAmount'), amount: totalAmount - peachFee },
      { text: i18n('tradeComplete.popup.tradeBreakdown.networkFees'), amount: networkFee },
    ],
    [{ text: i18n('tradeComplete.popup.tradeBreakdown.youGet'), amount: amountReceived }],
  ]

  return (
    <View style={tw`gap-4`}>
      {data.map((sectionData, index) => (
        <>
          <View style={tw`gap-3`}>
            {sectionData.map((item) => (
              <View style={tw`flex-row items-center justify-between`}>
                <PeachText style={tw`subtitle-1 text-black-65 shrink`}>{item.text}</PeachText>
                <BTCAmount amount={item.amount} size="small" />
              </View>
            ))}
          </View>
          {index !== data.length - 1 && <HorizontalLine style={tw`self-end bg-black-65 w-45`} />}
        </>
      ))}
    </View>
  )
}
