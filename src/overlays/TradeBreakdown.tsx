import React from 'react'
import { View } from 'react-native'
import { HorizontalLine, SatsFormat, Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { getTradeBreakdown } from '../utils/bitcoin'

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
        <SatsFormat
          containerStyle={tw`items-start justify-between h-5 w-45`}
          bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
          style={tw`font-normal leading-tight body-l`}
          satsStyle={tw`font-normal body-s`}
          sats={totalAmount}
        />
      </View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <Text style={tw`subtitle-1 text-black-2`}>{i18n('tradeComplete.popup.tradeBreakdown.peachFees')}</Text>
        <SatsFormat
          containerStyle={tw`items-start justify-between h-5 w-45`}
          bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
          style={tw`font-normal leading-tight body-l`}
          satsStyle={tw`font-normal body-s`}
          sats={peachFee}
        />
      </View>
      <HorizontalLine style={tw`self-end my-4 bg-black-2 w-45`} />

      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`subtitle-1 text-black-2`}>{i18n('tradeComplete.popup.tradeBreakdown.tradeAmount')}</Text>
        <SatsFormat
          containerStyle={tw`items-start justify-between h-5 w-45`}
          bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
          style={tw`font-normal leading-tight body-l`}
          satsStyle={tw`font-normal body-s`}
          sats={totalAmount - peachFee}
        />
      </View>
      <View style={tw`flex-row items-center justify-between mt-3`}>
        <Text style={tw`subtitle-1 text-black-2`}>{i18n('tradeComplete.popup.tradeBreakdown.networkFees')}</Text>
        <SatsFormat
          containerStyle={tw`items-start justify-between h-5 w-45`}
          bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
          style={tw`font-normal leading-tight body-l`}
          satsStyle={tw`font-normal body-s`}
          sats={networkFee}
        />
      </View>
      <HorizontalLine style={tw`self-end my-4 bg-black-2 w-45`} />
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`subtitle-1 text-black-2`}>{i18n('tradeComplete.popup.tradeBreakdown.youGet')}</Text>
        <SatsFormat
          containerStyle={tw`items-start justify-between h-5 w-45`}
          bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
          style={tw`font-normal leading-tight body-l`}
          satsStyle={tw`font-normal body-s`}
          sats={amountReceived}
        />
      </View>
    </View>
  )
}
