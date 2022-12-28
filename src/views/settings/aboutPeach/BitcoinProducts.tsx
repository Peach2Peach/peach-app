import React, { ReactElement, useContext, useMemo } from 'react'
import { Linking, View } from 'react-native'

import tw from '../../../styles/tailwind'

import { PrimaryButton, Text } from '../../../components'
import LanguageContext from '../../../contexts/language'
import i18n from '../../../utils/i18n'
import { useHeaderSetup } from '../../../hooks'

export default (): ReactElement => {
  useContext(LanguageContext)
  useHeaderSetup(useMemo(() => ({ title: i18n('settings.bitcoinProducts') }), []))

  const goToCryptoTag = () => Linking.openURL('https://cryptotag.io/')
  const goToShiftCrypto = () => Linking.openURL('https://shiftcrypto.ch/bitbox02/?ref=DLX6l9ccCc')

  return (
    <View style={tw`flex-1 items-center justify-center p-10`}>
      <Text style={tw`h5`}>{i18n('settings.bitcoinProducts.seedBackup')}</Text>
      <Text style={tw`body-m text-center mb-4`}>{i18n('settings.bitcoinProducts.seedBackup.description')}</Text>
      <PrimaryButton iconId="cryptotag" onPress={goToCryptoTag}>
        {i18n('settings.bitcoinProducts.cryptoTag')}
      </PrimaryButton>
      <Text style={tw`h5 mt-14`}>{i18n('settings.bitcoinProducts.proSecurity')}</Text>
      <Text style={tw`body-m text-center mb-4`}>{i18n('settings.bitcoinProducts.proSecurity.description')}</Text>
      <PrimaryButton iconId="bitbox" onPress={goToShiftCrypto}>
        {i18n('settings.bitcoinProducts.bitBox')}
      </PrimaryButton>
    </View>
  )
}
