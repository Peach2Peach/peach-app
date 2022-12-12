import React from 'react'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Selector } from '../../inputs'
import { Headline } from '../../text'
import { HorizontalLine } from '../../ui'
import { useMatchStore } from '../store'
import shallow from 'zustand/shallow'
import { useRoute } from '../../../hooks'
import { isBuyOffer } from '../../../utils/offer'

export const CurrencySelector = () => {
  const { offer } = useRoute<'search'>().params
  const { selectedCurrency, setSelectedCurrency, availableCurrencies } = useMatchStore(
    (state) => ({
      selectedCurrency: state.selectedCurrency,
      setSelectedCurrency: state.setSelectedCurrency,
      availableCurrencies: state.availableCurrencies,
    }),
    shallow,
  )
  const currencySelectorItems = availableCurrencies.map((c) => ({ value: c, display: c }))
  return (
    <>
      <HorizontalLine style={[tw`mt-4`, tw.md`mt-5`]} />
      <Headline style={[tw`mt-3 lowercase text-grey-2`, tw.md`mt-4`]}>
        {i18n(isBuyOffer(offer) ? 'form.currency' : 'match.selectedCurrency')}:
      </Headline>
      <Selector
        style={tw`mt-2`}
        selectedValue={selectedCurrency}
        items={currencySelectorItems}
        onChange={setSelectedCurrency}
      />
    </>
  )
}
