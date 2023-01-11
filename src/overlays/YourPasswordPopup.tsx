import React from 'react'
import { View } from 'react-native'

import { Text } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

const translationPath = 'settings.backups.fileBackup.popup2.content.'
export const YourPasswordPopup = () => (
  <>
    <Text>{i18n(translationPath + '1')}</Text>

    <Text style={tw`mt-3`}>{i18n(translationPath + '2')}</Text>

    <View style={tw`pl-1 my-3`}>
      <Text>{i18n(translationPath + '3')}</Text>
      <Text>{i18n(translationPath + '4')}</Text>
      <Text>{i18n(translationPath + '5')}</Text>
    </View>

    <Text style={tw`font-bold`}>{i18n(translationPath + '6')}</Text>
  </>
)
