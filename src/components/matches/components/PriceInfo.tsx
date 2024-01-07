import { View } from 'react-native'
import { Currency } from '../../../../peach-api/src/@types/global'
import tw from '../../../styles/tailwind'
import { BTCAmount } from '../../bitcoin/BTCAmount'
import { PeachText } from '../../text/PeachText'
import { PriceFormat } from '../../text/PriceFormat'
import { PremiumText } from './PremiumText'

type Props = {
  amount: number
  price: number
  currency: Currency
  premium: number
}
export function PriceInfo ({ amount, price, currency, premium }: Props) {
  return (
    <View style={tw`items-center gap-2`}>
      <BTCAmount amount={amount} size="medium" />
      <PeachText style={tw`text-center`}>
        <PriceFormat style={tw`subtitle-1`} currency={currency} amount={price} />
        <PremiumText premium={premium} />
      </PeachText>
    </View>
  )
}
