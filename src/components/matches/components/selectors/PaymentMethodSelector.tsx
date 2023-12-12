import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { CurrencySelection } from '../../../navigation/CurrencySelection'
import { MatchStore, useMatchStore } from '../../store'
import { CustomSelector } from './CustomSelector'
import { PaymentMethodSelectorText } from './PaymentMethodSelectorText'
import { PulsingText } from './PulsingText'

const storeSelector = (matchId: Match['offerId']) => (state: MatchStore) => ({
  selectedPaymentMethod: state.matchSelectors[matchId]?.selectedPaymentMethod,
  selectedCurrency: state.matchSelectors[matchId]?.selectedCurrency,
  setSelectedPaymentMethod: state.setSelectedPaymentMethod,
  setSelectedCurrency: state.setSelectedCurrency,
  availablePaymentMethods: state.matchSelectors[matchId]?.availablePaymentMethods || [],
  availableCurrencies: state.matchSelectors[matchId]?.availableCurrencies || [],
  showPaymentMethodPulse: state.matchSelectors[matchId]?.showPaymentMethodPulse || false,
})

export const PaymentMethodSelector = ({ matchId, disabled }: { matchId: Match['offerId']; disabled?: boolean }) => {
  const {
    selectedPaymentMethod,
    selectedCurrency,
    setSelectedPaymentMethod,
    setSelectedCurrency,
    availablePaymentMethods,
    availableCurrencies,
    showPaymentMethodPulse,
  } = useMatchStore(storeSelector(matchId), shallow)

  const onChange = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod, matchId)
  }

  const isVerified = false
  const items = availablePaymentMethods.map((p) => ({
    value: p,
    display: <PaymentMethodSelectorText isSelected={p === selectedPaymentMethod} isVerified={isVerified} name={p} />,
  }))

  return (
    <View style={disabled && tw`opacity-33`} pointerEvents={disabled ? 'none' : 'auto'}>
      <PulsingText style={tw`self-center mb-1`} showPulse={showPaymentMethodPulse}>
        {i18n('form.paymentMethod')}
      </PulsingText>

      <View style={tw`gap-3 pb-2`}>
        <CurrencySelection
          currencies={availableCurrencies}
          selected={selectedCurrency}
          select={(c) => setSelectedCurrency(c, matchId)}
        />

        <CustomSelector selectedValue={selectedPaymentMethod} {...{ items, onChange }} />
      </View>
    </View>
  )
}
