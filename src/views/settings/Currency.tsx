import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons, Screen } from '../../components'
import { CURRENCIES } from '../../constants'
import i18n from '../../utils/i18n'
import { useCurrencySetup } from './hooks/useCurrencySetup'

export const Currency = () => {
  const { currency, updateCurrency, goBack } = useCurrencySetup()

  return (
    <Screen>
      <PeachScrollView contentContainerStyle={[tw`justify-center flex-grow py-4`, tw.md`py-8`]}>
        <RadioButtons
          selectedValue={currency}
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
