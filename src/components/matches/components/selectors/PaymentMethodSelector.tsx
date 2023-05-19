import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { Divider } from '../../../Divider'
import { MeansOfPaymentSelect } from '../../../trade'
import { MatchStore, useMatchStore } from '../../store'

const storeSelector = (matchId: Match['offerId']) => (state: MatchStore) => ({
  selectedPaymentMethod: state.matchSelectors[matchId]?.selectedPaymentMethod,
  selectedCurrency: state.matchSelectors[matchId]?.selectedCurrency,
  setSelectedPaymentMethod: state.setSelectedPaymentMethod,
  setSelectedCurrency: state.setSelectedCurrency,
  availablePaymentMethods: state.matchSelectors[matchId]?.availablePaymentMethods || [],
  availableCurrencies: state.matchSelectors[matchId]?.availableCurrencies || [],
  mopsInCommon: state.matchSelectors[matchId]?.mopsInCommon || {},
  showMissingPaymentMethodWarning: state.matchSelectors[matchId]?.showMissingPaymentMethodWarning || false,
})

export const PaymentMethodSelector = ({ matchId, disabled }: { matchId: Match['offerId']; disabled?: boolean }) => {
  const {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    setSelectedCurrency,
    mopsInCommon,
    showMissingPaymentMethodWarning,
  } = useMatchStore(storeSelector(matchId), shallow)

  const setCurrency = (currency: Currency) => setSelectedCurrency(currency, matchId)
  const setPaymentMethod = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod, matchId)
  }

  return (
    <View style={[tw`gap-1`, tw.md`gap-3`, disabled && tw`opacity-33`]} pointerEvents={disabled ? 'none' : 'auto'}>
      <Divider text={i18n('paymentMethod')} type={showMissingPaymentMethodWarning ? 'error' : undefined} />
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
