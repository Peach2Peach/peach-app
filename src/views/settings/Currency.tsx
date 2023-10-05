import tw from '../../styles/tailwind'

import { shallow } from 'zustand/shallow'
import { Header, PeachScrollView, PrimaryButton, RadioButtons, Screen } from '../../components'
import { useNavigation } from '../../hooks'
import { CURRENCIES } from '../../paymentMethods'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { useSettingsStore } from '../../store/settingsStore'
import i18n from '../../utils/i18n'

export const Currency = () => {
  const navigation = useNavigation()
  const setBitcoinCurrency = useBitcoinStore((state) => state.setCurrency)
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  )

  const updateCurrency = (c: Currency) => {
    setBitcoinCurrency(c)
    setDisplayCurrency(c)
  }

  const goBack = () => {
    navigation.goBack()
  }

  return (
    <Screen>
      <Header title={i18n('currency')} />
      <PeachScrollView contentContainerStyle={[tw`justify-center py-4 grow`, tw.md`py-8`]}>
        <RadioButtons
          selectedValue={displayCurrency}
          items={CURRENCIES.map((c) => ({ value: c, display: i18n(`currency.${c}`) }))}
          onButtonPress={updateCurrency}
        />
      </PeachScrollView>
      <PrimaryButton onPress={goBack} style={tw`self-center mb-5 mt-18px`} narrow>
        {i18n('confirm')}
      </PrimaryButton>
    </Screen>
  )
}
