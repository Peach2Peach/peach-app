import React, { ReactElement, useContext, useReducer, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Button, SelectorBig, Title } from '../../components'
import i18n from '../../utils/i18n'
import { CURRENCIES } from '../../constants'
import BitcoinContext from '../../contexts/bitcoin'
import { updateSettings } from '../../utils/account'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contact'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [bitcoinContext, updateBitcoinContext] = useContext(BitcoinContext)
  const { currency } = bitcoinContext

  const setCurrency = (c: Currency) => {
    updateSettings({ displayCurrency: c }, true)
    updateBitcoinContext({ currency: c })
  }

  return <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
    <Title title={i18n('settings.title')} subtitle={i18n('settings.displayCurrency.subtitle')} />
    <View style={tw`h-full flex-shrink mt-12`}>
      <SelectorBig
        style={tw`mt-2`}
        selectedValue={currency}
        items={CURRENCIES.map(c => ({ value: c, display: c }))}
        onChange={c => setCurrency(c as Currency)}
      />
    </View>
    <View style={tw`flex items-center mt-16`}>
      <Button
        title={i18n('back')}
        wide={false}
        secondary={true}
        onPress={navigation.goBack}
      />
    </View>
  </View>
}

