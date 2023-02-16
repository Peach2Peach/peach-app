import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, Icon } from '../components'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'

export const BackupCreated = (): ReactElement => (
  <View style={tw`flex items-center`}>
    <Headline style={tw`text-3xl text-center text-white-1 font-baloo leading-3xl`}>
      {i18n('settings.backups.created')}
    </Headline>
    <View style={tw`flex items-center justify-center w-16 h-16 rounded-full bg-green`}>
      <Icon id="check" style={tw`w-12 h-12`} color={tw`text-white-1`.color} />
    </View>
  </View>
)
