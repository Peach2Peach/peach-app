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
  const color = match.premium < 0 ? tw`text-success-main` : match.premium > 0 ? tw`text-primary-main` : tw`text-black-4`
  return (
    <>
      <HorizontalLine style={tw`mb-2 bg-black-5`} />
      <SatsFormat
        sats={match?.amount || 0}
        containerStyle={tw`self-center justify-center`}
        satsStyle={tw`subtitle-1`}
        style={tw` h5 leading-3xl`}
        bitcoinLogoStyle={tw`w-[18px] h-[18px] mr-2`}
      />
      <Text style={tw`self-center mb-2 subtitle-1`}>
        {i18n(`currency.format.${selectedCurrency}`, displayPrice)}{' '}
        <Text style={[tw`subtitle-1`, color]}>
          ({match.premium > 0 ? '+' : ''}
          {String(match.premium)}%)
        </Text>
      </Text>
    </>
  )
}
