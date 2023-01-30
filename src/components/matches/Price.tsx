import React from 'react'
import { TextStyle } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Text } from '../text'
import { useMatchStore } from './store'
import { getDisplayPrice } from './utils'

type Props = ComponentProps & {
  match: Match
  fontStyle: TextStyle
  isBuyOffer: boolean
}

export const Price = ({ match, fontStyle, isBuyOffer, style }: Props) => {
  const selectedCurrency = useMatchStore((state) => state.matchSelectors[match.offerId]?.selectedCurrency)
  const selectedPaymentMethod = useMatchStore((state) => state.matchSelectors[match.offerId]?.selectedPaymentMethod)
  const displayPrice = getDisplayPrice(match, selectedPaymentMethod, selectedCurrency || 'EUR')

  const colors = [tw`text-success-main`, tw`text-black-4`, tw`text-primary-main`]

  const colorIndex = match.premium < 0 ? 0 : match.premium === 0 ? 1 : 2
  const color = isBuyOffer ? colors[colorIndex] : colors[Math.abs(colorIndex - 2)]
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
