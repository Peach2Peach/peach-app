import { shallow } from 'zustand/shallow'
import { RadioButtons } from '../../components'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { Button } from '../../components/buttons/Button'
import { useNavigation } from '../../hooks'
import { CURRENCIES } from '../../paymentMethods'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const Currency = () => {
  const navigation = useNavigation()
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  )

  const goBack = () => {
    navigation.goBack()
  }

  return (
    <Screen header={i18n('currency')}>
      <PeachScrollView style={tw`mb-4`} contentContainerStyle={[tw`justify-center py-4 grow`, tw`md:py-8`]}>
        <RadioButtons
          selectedValue={displayCurrency}
          items={CURRENCIES.map((c) => ({ value: c, display: i18n(`currency.${c}`) }))}
          onButtonPress={setDisplayCurrency}
        />
      </PeachScrollView>
      <Button onPress={goBack} style={tw`self-center`}>
        {i18n('confirm')}
      </Button>
    </Screen>
  )
}
