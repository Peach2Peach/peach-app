import React, { ReactElement, useMemo, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { useNavigation } from '@react-navigation/native'
import shallow from 'zustand/shallow'
import { PrimaryButton, RadioButtons } from '../../components'
import { CURRENCIES } from '../../constants'
import { useHeaderSetup } from '../../hooks'
import { useBitcoinStore } from '../../store/bitcoinStore'
import { updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  const navigation = useNavigation()
  const [currency, setCurrency] = useBitcoinStore((state) => [state.currency, state.setCurrency], shallow)
  const [loading, setLoading] = useState(false)

  useHeaderSetup(useMemo(() => ({ title: i18n('currency') }), []))

  const updateCurrency = (c: Currency) => {
    setLoading(true)
    updateSettings({ displayCurrency: c }, true)
    setCurrency(c)
    setLoading(false)
    navigation.goBack()
  }

  return (
    <View style={tw`h-full flex pt-6 px-6 pb-10 bg-primary-background`}>
      <View style={tw`h-full items-center justify-center`}>
        <RadioButtons
          style={tw`mt-2`}
          selectedValue={currency}
          items={CURRENCIES.map((c) => ({ value: c, display: i18n(`currency.${c}`) }))}
          onChange={setCurrency}
        />
      </View>
      <PrimaryButton
        onPress={() => updateCurrency(currency)}
        style={tw`absolute bottom-0 self-center mb-6`}
        loading={loading}
      >
        {i18n('confirm')}
      </PrimaryButton>
    </View>
  )
}
