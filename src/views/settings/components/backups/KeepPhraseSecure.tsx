import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { Icon, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

const translationsPath = 'settings.backups.seedPhrase.'
export const KeepPhraseSecure = (): ReactElement => (
  <>
    <Text style={tw`self-center h6 mt-44`}>{i18n(translationsPath + 'keepSecure')}</Text>
    <View style={tw`flex-row items-center mt-6`}>
      <Icon id="unlock" color={tw`text-black-2`.color} style={tw`w-12 h-12`} />
      <Text style={tw`pl-4 body-m`}>{i18n(translationsPath + 'storeSafely')}</Text>
    </View>
  </>
)
