import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { PrimaryButton, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import i18n from '../../utils/i18n'
import { useCurrencySetup } from './hooks/useCurrencySetup'

export default (): ReactElement => {
  const { currency, setCurrency, updateCurrency } = useCurrencySetup()

  return (
    <View style={tw`flex h-full px-6 pt-6 pb-10 bg-primary-background`}>
      <View style={tw`items-center justify-center h-full`}>
        <RadioButtons
          style={tw`mt-2`}
          selectedValue={currency}
          items={CURRENCIES.map((c) => ({ value: c, display: i18n(`currency.${c}`) }))}
          onChange={setCurrency}
        />
      </View>
      <PrimaryButton onPress={() => updateCurrency(currency)} style={tw`absolute bottom-0 self-center mb-6`}>
        {i18n('confirm')}
      </PrimaryButton>
    </View>
  )
}
