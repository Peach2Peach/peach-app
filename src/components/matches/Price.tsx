import React from 'react'
import { TextStyle } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Text } from '../text'
import { getPremiumColor } from './utils/getPremiumColor'
import { useMatchStore } from './store'
import { getDisplayPrice } from './utils'

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
  const displayPrice = getDisplayPrice(match, selectedPaymentMethod, selectedCurrency)
  const color = getPremiumColor(match.premium, isBuyOffer)
  return (
    <Text style={[tw`self-center mb-2`, fontStyle, style]}>
      {i18n(`currency.format.${selectedCurrency}`, displayPrice)}{' '}
      <Text style={[fontStyle, color]}>
        ({match.premium > 0 ? '+' : ''}
        {String(match.premium)}%)
      </Text>
    </Text>
  )
}
