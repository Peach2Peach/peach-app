import { shallow } from 'zustand/shallow'
import { Header, Screen } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useShowHelp } from '../../hooks'
import { useOfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { Premium } from './Premium'
import { CurrentOfferPrice, SellTitleComponent } from './components'
import { usePremiumStepValidation } from './hooks/usePremiumStepValidation'

export const OfferPreferencePremium = () => {
  const navigation = useNavigation()
  usePremiumStepValidation()
  const isStepValid = useOfferPreferences((state) => state.canContinue.premium)
  const amount = useOfferPreferences((state) => state.sellAmount)
  const [premium, setPremium] = useOfferPreferences((state) => [state.premium, state.setPremium], shallow)
  const next = () => navigation.navigate('sellPreferences')

  return (
    <Screen header={<PremiumHeader />}>
      <Premium
        {...{ premium, setPremium, amount }}
        confirmButton={
          <Button style={tw`self-center`} disabled={!isStepValid} onPress={next}>
            {i18n('next')}
          </Button>
        }
        offerPrice={<CurrentOfferPrice />}
      />
    </Screen>
  )
}

function PremiumHeader () {
  const showHelp = useShowHelp('premium')
  return (
    <Header
      titleComponent={<SellTitleComponent />}
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
      hideGoBackButton
      showPriceStats
    />
  )
}
