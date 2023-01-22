import React from 'react'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { Text } from '../../../text'
import { HorizontalLine } from '../../../ui'
import { useMatchStore } from '../../store'
import shallow from 'zustand/shallow'
import { isBuyOffer } from '../../../../utils/offer'
import { CustomSelector } from './CustomSelector'
import { PulsingText } from './PulsingText'

export const CurrencySelector = ({ matchId }: { matchId: Match['offerId'] }) => {
  const { offer, selectedValue, setSelectedCurrency, availableCurrencies, showCurrencyPulse } = useMatchStore(
    (state) => ({
      offer: state.offer,
      selectedValue: state.matchSelectors[matchId]?.selectedCurrency,
      setSelectedCurrency: state.setSelectedCurrency,
      availableCurrencies: state.matchSelectors[matchId]?.availableCurrencies || [],
      showCurrencyPulse: state.matchSelectors[matchId]?.showCurrencyPulse || false,
    }),
    shallow,
  )

  const onChange = (currency: Currency) => {
    setSelectedCurrency(currency, matchId)
  }
  const items = availableCurrencies.map((c) => ({
    value: c,
    display: (
      <Text
        style={[tw`self-center button-medium text-black-3`, c === selectedValue && tw`text-primary-background-light`]}
      >
        {c}
      </Text>
    ),
  }))
  return (
    <>
      <HorizontalLine style={tw`mb-4 bg-black-5`} />
      <PulsingText style={tw`self-center mb-1`} showPulse={showCurrencyPulse}>
        {i18n(isBuyOffer(offer) ? 'form.currency' : 'match.selectedCurrency')}
      </PulsingText>
      <CustomSelector style={tw`self-center mb-6`} {...{ selectedValue, items, onChange }} />
    </>
  )
}
