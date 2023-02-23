import React from 'react'
import tw from '../../styles/tailwind'
import { PriceFormat, Text } from '../text'
import { useMatchStore } from './store'
import { getMatchPrice } from './utils'

type Props = ComponentProps & {
  match: Match
}

export const Price = ({ match, style }: Props) => {
  const selectedCurrency = useMatchStore(
    (state) =>
      state.matchSelectors[match.offerId]?.selectedCurrency
      || state.matchSelectors[match.offerId]?.availableCurrencies[0],
  )
  const selectedPaymentMethod = useMatchStore((state) => state.matchSelectors[match.offerId]?.selectedPaymentMethod)
  const displayPrice = getMatchPrice(match, selectedPaymentMethod, selectedCurrency)
  return (
    <Text style={[tw`self-center body-l`, style]}>
      <PriceFormat style={tw`body-l`} currency={selectedCurrency} amount={displayPrice} />
    </Text>
  )
}
