import { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { PeachScrollView, PrimaryButton, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import i18n from '../../utils/i18n'
import { useCurrencySetup } from './hooks/useCurrencySetup'
const { LinearGradient } = require('react-native-gradients')
import { whiteGradient } from '../../utils/layout'

export default (): ReactElement => {
  const { currency, setCurrency, updateCurrency } = useCurrencySetup()

  return (
    <View style={tw`flex h-full`}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow px-10 pb-10`}>
        <RadioButtons
          style={tw`mt-2`}
          selectedValue={currency}
          items={CURRENCIES.map((c) => ({ value: c, display: i18n(`currency.${c}`) }))}
          onChange={setCurrency}
        />
      </PeachScrollView>
      <View style={tw`flex items-center w-full px-6 mt-4 bg-primary-background`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <PrimaryButton testID="navigation-next" onPress={() => updateCurrency(currency)} style={tw`mb-6`}>
          {i18n('confirm')}
        </PrimaryButton>
      </View>
    </View>
  )
}
