import { shallow } from 'zustand/shallow'
import { PrimaryButton, Text } from '../..'
import { useNavigation, usePreviousRouteName } from '../../../hooks'
import { useUserPaymentMethodInfo } from '../../../hooks/query/useUserPaymentMethodInfo'
import { InfoPopup } from '../../../popups/InfoPopup'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import { intersect } from '../../../utils/array'
import i18n from '../../../utils/i18n'

export const NextButton = () => {
  const navigation = useNavigation()
  const setPopup = usePopupStore((state) => state.setPopup)
  const showHelp = () => setPopup(<InfoPopup content={<Text>{i18n('FORBIDDEN_PAYMENT_METHOD.paypal.text')}</Text>} />)
  const origin = usePreviousRouteName()
  const [isStepValid, paymentMethods] = useOfferPreferences(
    (state) => [state.canContinue.paymentMethods, Object.values(state.meansOfPayment).flat()],
    shallow,
  )
  const { data: paymentMethodInfo } = useUserPaymentMethodInfo()

  const goToSummary = () => {
    const flow = origin === 'premium' ? 'sell' : 'buy'
    const forbiddenPaymentMethdos = intersect(paymentMethodInfo.forbidden[flow], paymentMethods)
    if (forbiddenPaymentMethdos.length) {
      const paymentMethod = forbiddenPaymentMethdos.pop()
      if (paymentMethod === 'paypal') showHelp()
      return
    }
    navigation.navigate(flow === 'sell' ? 'sellSummary' : 'buySummary')
  }

  return (
    <PrimaryButton style={tw`self-center`} disabled={!isStepValid} onPress={goToSummary} narrow>
      {i18n('next')}
    </PrimaryButton>
  )
}
