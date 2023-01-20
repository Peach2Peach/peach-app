import React from 'react'
import shallow from 'zustand/shallow'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { isBuyOffer } from '../../../../utils/offer'
import { Text } from '../../../text'
import { HorizontalLine } from '../../../ui'
import { useMatchStore } from '../../store'
import { CustomSelector } from './CustomSelector'
import { PaymentMethodSelectorText } from './PaymentMethodSelectorText'

export const PaymentMethodSelector = ({ matchId }: { matchId: Match['offerId'] }) => {
  const { offer, selectedValue, selectedCurrency, setSelectedPaymentMethod, availablePaymentMethods } = useMatchStore(
    (state) => ({
      offer: state.offer,
      selectedValue: state.matchSelectors[matchId]?.selectedPaymentMethod,
      selectedCurrency: state.matchSelectors[matchId]?.selectedCurrency,
      setSelectedPaymentMethod: state.setSelectedPaymentMethod,
      availablePaymentMethods: state.matchSelectors[matchId]?.availablePaymentMethods || [],
    }),
    shallow,
  )
  const onChange = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod, matchId)
  }

  const isVerified = false
  const disabled = !selectedCurrency
  const items = availablePaymentMethods.map((p) => ({
    value: p,
    display: <PaymentMethodSelectorText isSelected={p === selectedValue} isVerified={isVerified} name={p} />,
  }))
  return (
    <>
      <HorizontalLine style={tw`mb-4`} />
      <Text style={tw`self-center mb-1`}>
        {i18n(isBuyOffer(offer) ? 'form.paymentMethod' : 'match.selectedPaymentMethod')}
      </Text>
      <CustomSelector style={tw`mb-6`} {...{ selectedValue, items, onChange, disabled }} />
    </>
  )
}
