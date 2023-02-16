import React from 'react'
import { TextStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { PriceFormat, Text } from '../text'
import { getPremiumColor } from './utils/getPremiumColor'
import { useMatchStore } from './store'
import { getMatchPrice } from './utils'

type Props = ComponentProps & {
  match: Match
  fontStyle: TextStyle
  isBuyOffer: boolean
}

export const Price = ({ match, fontStyle, isBuyOffer, style }: Props) => {
  const selectedCurrency = useMatchStore(
    (state) =>
      state.matchSelectors[match.offerId]?.selectedCurrency
      || state.matchSelectors[match.offerId]?.availableCurrencies[0],
  )
  const selectedPaymentMethod = useMatchStore((state) => state.matchSelectors[match.offerId]?.selectedPaymentMethod)
  const displayPrice = getMatchPrice(match, selectedPaymentMethod, selectedCurrency)
  const color = getPremiumColor(match.premium, isBuyOffer)
  return (
    <Text style={[tw`self-center mb-2`, fontStyle, style]}>
      <PriceFormat style={fontStyle} currency={selectedCurrency} amount={displayPrice} />{' '}
      <Text style={[fontStyle, color]}>
        ({match.premium > 0 ? '+' : ''}
        {String(match.premium)}%)
      </Text>
    </Text>
  )
}
