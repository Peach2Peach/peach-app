import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text, TextLink } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { linkToAppStore } from '../utils/system'

export const CriticalUpdate = (): ReactElement => (
  <View>
    <Text style={tw`text-lg text-center font-baloo text-white-2`}>{i18n('app.incompatible.title')}</Text>
    <Text style={tw`mt-2 text-sm text-center text-white-2`}>{i18n('app.incompatible.description')}</Text>
    <TextLink onPress={linkToAppStore} style={tw`mt-2 text-sm text-center text-white-2`}>
      {i18n('downloadNow')}
    </TextLink>
  </View>
)

export const NewVersionAvailable = (): ReactElement => (
  <View>
    <Text style={tw`text-lg text-center font-baloo text-white-2`}>{i18n('app.updateAvailable.title')}</Text>
    <Text style={tw`mt-2 text-sm text-center text-white-2`}>{i18n('app.updateAvailable.description')}</Text>
    <TextLink onPress={linkToAppStore} style={tw`mt-2 text-sm text-center text-white-2`}>
      {i18n('downloadNow')}
    </TextLink>
  </View>
)
