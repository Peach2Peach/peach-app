import React from 'react'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Selector } from '../../inputs'
import { Headline } from '../../text'
import { HorizontalLine } from '../../ui'
import { useMatchStore } from '../store'
import shallow from 'zustand/shallow'
import { isBuyOffer } from '../../../utils/offer'

export const CurrencySelector = ({ matchId }: { matchId: Match['offerId'] }) => {
  const { offer, selectedValue, setSelectedCurrency, availableCurrencies } = useMatchStore(
    (state) => ({
      offer: state.offer,
      selectedValue: state.matchSelectors[matchId]?.selectedCurrency,
      setSelectedCurrency: state.setSelectedCurrency,
      availableCurrencies: state.matchSelectors[matchId]?.availableCurrencies || [],
    }),
    shallow,
  )

  const onChange = (currency: Currency) => {
    setSelectedCurrency(currency, matchId)
  }
  const items = availableCurrencies.map((c) => ({ value: c, display: c }))
  return (
    <>
      <HorizontalLine style={[tw`mt-4`, tw.md`mt-5`]} />
      <Headline style={[tw`mt-3 lowercase text-grey-2`, tw.md`mt-4`]}>
        {i18n(isBuyOffer(offer) ? 'form.currency' : 'match.selectedCurrency')}:
      </Headline>
      <Selector style={tw`mt-2`} {...{ selectedValue, items, onChange }} />
    </>
  )
}
