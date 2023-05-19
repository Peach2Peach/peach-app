import { ViewProps } from 'react-native'
import tw from '../../../styles/tailwind'
import { getAvailableCurrencies } from '../../../utils/match'
import { hasMoPsInCommon, getMoPsInCommon } from '../../../utils/paymentMethod'
import { PriceFormat, Text } from '../../text'
import { useMatchStore } from '../store'
import { getMatchPrice } from '../utils'

type Props = ComponentProps & {
  match: Match
  offer: BuyOffer | SellOffer
  textStyle?: ViewProps | ViewProps[]
}

export const Price = ({ match, offer, style, textStyle }: Props) => {
  const mopsInCommon = hasMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    ? getMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    : match.meansOfPayment
  const selectedCurrency
    = useMatchStore(
      (state) =>
        state.matchSelectors[match.offerId]?.selectedCurrency
        || state.matchSelectors[match.offerId]?.availableCurrencies[0],
    ) || getAvailableCurrencies(mopsInCommon, match.meansOfPayment)[0]
  const selectedPaymentMethod = useMatchStore((state) => state.matchSelectors[match.offerId]?.selectedPaymentMethod)
  const displayPrice = getMatchPrice(match, selectedPaymentMethod, selectedCurrency)
  return (
    <Text style={[tw`body-l`, style]}>
      <PriceFormat style={[tw`body-l`, textStyle]} currency={selectedCurrency} amount={displayPrice} />
    </Text>
  )
}
