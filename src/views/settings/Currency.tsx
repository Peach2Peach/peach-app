import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import i18n from '../../utils/i18n'
import { useCurrencySetup } from './hooks/useCurrencySetup'

export const Currency = () => {
  const { currency, updateCurrency, goBack } = useCurrencySetup()

  return (
    <View style={[tw`h-full px-4`, tw.md`px-8`]}>
      <PeachScrollView contentContainerStyle={[tw`py-4`, tw.md`py-8`]}>
        <RadioButtons
          selectedValue={currency}
          items={CURRENCIES.map((c) => ({ value: c, display: i18n(`currency.${c}`) }))}
          onChange={updateCurrency}
        />
      </PeachScrollView>
      <PrimaryButton onPress={goBack} style={tw`self-center mb-5 mt-18px`} narrow>
        {i18n('confirm')}
      </PrimaryButton>
    </View>
  )
}
