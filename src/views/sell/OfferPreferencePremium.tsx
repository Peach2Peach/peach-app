import { shallow } from 'zustand/shallow'
import { PrimaryButton } from '../../components'
import { useNavigation } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { CurrentOfferPrice } from './components'
import { usePremiumSetup } from './hooks/usePremiumSetup'
import { Premium } from './Premium'

export const OfferPreferencePremium = () => {
  const navigation = useNavigation()
  usePremiumSetup()
  const isStepValid = useOfferPreferences((state) => state.canContinue.premium)
  const amount = useOfferPreferences((state) => state.sellAmount)
  const [premium, setPremium] = useOfferPreferences((state) => [state.premium, state.setPremium], shallow)
  const next = () => navigation.navigate('sellPreferences')

  return (
    <Premium
      premium={premium}
      setPremium={setPremium}
      amount={amount}
      confirmButton={
        <PrimaryButton style={tw`self-center mb-5`} disabled={!isStepValid} narrow onPress={next}>
          {i18n('next')}
        </PrimaryButton>
      }
      offerPrice={<CurrentOfferPrice />}
    />
  )
}
