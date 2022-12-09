import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { PrimaryButton, RadioButtons, Selector, SelectorBig, Title } from '../../components'
import { CURRENCIES } from '../../constants'
import BitcoinContext from '../../contexts/bitcoin'
import LanguageContext from '../../contexts/language'
import { updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { useNavigation } from '@react-navigation/native'

export default (): ReactElement => {
  const navigation = useNavigation()
  useContext(LanguageContext)
  const [bitcoinContext, updateBitcoinContext] = useContext(BitcoinContext)

  const { currency } = bitcoinContext
  const [selectedCurrency, setSelectedCurrency] = useState(currency)
  const [loading, setLoading] = useState(false)

  const updateCurrency = (c: Currency) => {
    setLoading(true)
    updateSettings({ displayCurrency: c }, true)
    updateBitcoinContext({ currency: c })
    setLoading(false)
    navigation.goBack()
  }

  return (
    <View style={tw`h-full flex pt-6 px-6 pb-10`}>
      <View style={tw`h-full items-center justify-center`}>
        <RadioButtons
          style={tw`mt-2`}
          selectedValue={selectedCurrency}
          items={CURRENCIES.map((c) => ({ value: c, display: c }))}
          onChange={(c) => setSelectedCurrency(c as Currency)}
        />
      </View>
      <PrimaryButton
        onPress={() => updateCurrency(selectedCurrency)}
        style={tw`absolute bottom-0 self-center mb-6`}
        loading={loading}
      >
        {i18n('confirm')}
      </PrimaryButton>
    </View>
  )
}
