import { shallow } from 'zustand/shallow'
import { PrimaryButton } from '../..'
import { useNavigation, usePreviousRouteName, useShowHelp } from '../../../hooks'
import { useUserPaymentMethodInfo } from '../../../hooks/query/useUserPaymentMethodInfo'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'
import { intersect } from '../../../utils/array'
import i18n from '../../../utils/i18n'

export const NextButton = () => {
  const navigation = useNavigation()
  const showHelp = useShowHelp('paymentMethodForbidden.paypal')
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
      if (paymentMethod === 'paypal') showHelp(`paymentMethodForbidden.${paymentMethod}`)
      return
    }
    navigation.navigate(flow === 'sell' ? 'sellSummary' : 'buySummary')
  }

  return (
    <PrimaryButton disabled={!isStepValid} onPress={goToSummary} narrow>
      {i18n('next')}
    </PrimaryButton>
  )
}
