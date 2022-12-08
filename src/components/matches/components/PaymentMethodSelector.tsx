import React from 'react'
import shallow from 'zustand/shallow'
import { useRoute } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Selector } from '../../inputs'
import { Headline } from '../../text'
import { HorizontalLine } from '../../ui'
import { useMatchStore } from '../store'

export const PaymentMethodSelector = () => {
  const { offer } = useRoute<'search'>().params
  const { selectedPaymentMethod, setSelectedPaymentMethod, availablePaymentMethods } = useMatchStore(
    (state) => ({
      selectedPaymentMethod: state.selectedPaymentMethod,
      setSelectedPaymentMethod: state.setSelectedPaymentMethod,
      availablePaymentMethods: state.availablePaymentMethods,
    }),
    shallow,
  )
  const paymentMethodSelectorItems = availablePaymentMethods.map((p) => ({
    value: p,
    display: i18n(`paymentMethod.${p}`),
  }))
  return (
    <>
      <HorizontalLine style={[tw`mt-4`, tw.md`mt-5`]} />
      <Headline style={[tw`mt-3 lowercase text-grey-2`, tw.md`mt-4`]}>
        {i18n(offer.type === 'bid' ? 'form.paymentMethod' : 'match.selectedPaymentMethod')}:
      </Headline>
      <Selector
        style={tw`mt-2`}
        selectedValue={selectedPaymentMethod}
        items={paymentMethodSelectorItems}
        onChange={setSelectedPaymentMethod}
      />
    </>
  )
}
