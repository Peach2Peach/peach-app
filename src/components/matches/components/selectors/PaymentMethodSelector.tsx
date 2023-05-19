import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { MeansOfPaymentSelect } from '../../../trade'
import { MatchStore, useMatchStore } from '../../store'
import { PulsingText } from './PulsingText'

const storeSelector = (matchId: Match['offerId']) => (state: MatchStore) => ({
  selectedPaymentMethod: state.matchSelectors[matchId]?.selectedPaymentMethod,
  selectedCurrency: state.matchSelectors[matchId]?.selectedCurrency,
  setSelectedPaymentMethod: state.setSelectedPaymentMethod,
  setSelectedCurrency: state.setSelectedCurrency,
  availablePaymentMethods: state.matchSelectors[matchId]?.availablePaymentMethods || [],
  availableCurrencies: state.matchSelectors[matchId]?.availableCurrencies || [],
  mopsInCommon: state.matchSelectors[matchId]?.mopsInCommon || {},
  showPaymentMethodPulse: state.matchSelectors[matchId]?.showPaymentMethodPulse || false,
})

export const PaymentMethodSelector = ({ matchId, disabled }: { matchId: Match['offerId']; disabled?: boolean }) => {
  const { selectedPaymentMethod, setSelectedPaymentMethod, setSelectedCurrency, mopsInCommon, showPaymentMethodPulse }
    = useMatchStore(storeSelector(matchId), shallow)

  const setCurrency = (currency: Currency) => setSelectedCurrency(currency, matchId)
  const setPaymentMethod = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod, matchId)
  }

  return (
    <View style={disabled && tw`opacity-33`} pointerEvents={disabled ? 'none' : 'auto'}>
      <PulsingText style={tw`self-center mb-1`} showPulse={showPaymentMethodPulse}>
        {i18n('form.paymentMethod')}
      </PulsingText>
      <MeansOfPaymentSelect
        meansOfPayment={mopsInCommon}
        {...{
          setCurrency,
          setPaymentMethod,
          selectedPaymentMethod,
        }}
      />
    </View>
  )
}
