import React from 'react'
import shallow from 'zustand/shallow'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { SatsFormat, Text } from '../../text'
import { HorizontalLine } from '../../ui'
import { useMatchStore } from '../store'
import { getDisplayPrice } from '../utils'

type PriceInfoProps = {
  match: Match
}

export const PriceInfo = ({ match }: PriceInfoProps) => {
  const { selectedCurrency, selectedPaymentMethod } = useMatchStore(
    (state) => ({
      selectedCurrency:
        state.matchSelectors[match.offerId]?.selectedCurrency
        || state.matchSelectors[match.offerId]?.availableCurrencies[0],
      selectedPaymentMethod: state.matchSelectors[match.offerId]?.selectedPaymentMethod,
    }),
    shallow,
  )
  const displayPrice = getDisplayPrice(match, selectedPaymentMethod, selectedCurrency)
  return (
    <>
      <HorizontalLine style={[tw`mt-3`, tw.md`mt-4`]} />
      <SatsFormat sats={match.matchedPrice} />
      <Text style={tw`text-xl text-center font-baloo leading-xl text-peach-1`}>
        {i18n(`currency.format.${selectedCurrency}`, displayPrice)}{' '}
        <Text style={tw`ml-2 text-lg text-center leading-lg text-grey-2`}>({String(match.premium)}% )</Text>
      </Text>
    </>
  )
}
