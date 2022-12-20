import React from 'react'
import { View } from 'react-native'
import shallow from 'zustand/shallow'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Text } from '../../text'
import { HorizontalLine } from '../../ui'
import { useMatchStore } from '../store'
import { getDisplayPrice } from '../utils'

type PriceInfoProps = {
  match: Match
}

export const PriceInfo = ({ match }: PriceInfoProps) => {
  const { selectedCurrency, selectedPaymentMethod } = useMatchStore(
    (state) => ({
      selectedCurrency: state.matchSelectors[match.offerId]?.selectedCurrency,
      selectedPaymentMethod: state.matchSelectors[match.offerId]?.selectedPaymentMethod,
    }),
    shallow,
  )
  const displayPrice = getDisplayPrice(match, selectedPaymentMethod, selectedCurrency)
  return (
    <>
      <HorizontalLine style={[tw`mt-3`, tw.md`mt-4`]} />
      <View style={[tw`mt-3`, tw.md`mt-4`]}>
        <Text style={tw`font-baloo text-xl leading-xl text-peach-1 text-center`}>
          {i18n(`currency.format.${selectedCurrency}`, displayPrice)}
        </Text>
        <Text style={tw`text-lg leading-lg text-center text-grey-2 ml-2`}>
          (
          {i18n(match.premium > 0 ? 'offer.summary.premium' : 'offer.summary.discount', String(Math.abs(match.premium)))}
          )
        </Text>
      </View>
    </>
  )
}
