import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { BTCAmount } from '../../bitcoin'
import { PriceFormat, Text } from '../../text'
import { useMatchPriceData } from '../hooks'
import { PremiumText } from './PremiumText'

type Props = {
  match: Match
  offer: BuyOffer | SellOffer
}

export const PriceInfo = ({ match, offer }: Props) => {
  const { premium, displayPrice, selectedCurrency } = useMatchPriceData(match, offer)
  return (
    <View style={tw`items-center gap-2`}>
      <BTCAmount amount={match.amount} size="medium" />
      <Text style={tw`text-center`}>
        <PriceFormat style={tw`body-l subtitle-1`} currency={selectedCurrency} amount={displayPrice} />
        <PremiumText premium={premium} />
      </Text>
    </View>
  )
}
