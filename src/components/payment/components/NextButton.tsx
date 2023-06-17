import { PrimaryButton } from '../..'
import { useNavigation, usePreviousRouteName } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { useOfferPreferences } from '../../../store/offerPreferenes/useOfferPreferences'

export const NextButton = () => {
  const navigation = useNavigation()
  const origin = usePreviousRouteName()
  const goToSummary = () => {
    navigation.navigate(origin === 'premium' ? 'sellSummary' : 'buySummary')
  }
  const isStepValid = useOfferPreferences((state) => state.canContinue.paymentMethods)

  return (
    <PrimaryButton disabled={!isStepValid} onPress={goToSummary} narrow>
      {i18n('next')}
    </PrimaryButton>
  )
}
