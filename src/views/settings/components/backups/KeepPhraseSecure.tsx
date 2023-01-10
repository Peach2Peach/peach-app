import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import { Icon, Text } from '../../../../components'
import i18n from '../../../../utils/i18n'

const translationsPath = 'settings.backups.seedPhrase.'
const items = [
  {
    id: 'edit',
    text: 'writeItDown',
    color: tw`text-success-main`.color,
  },
  {
    id: 'cameraOff',
    text: 'noPictures',
    color: tw`text-error-main`.color,
  },
  {
    id: 'cloudOff',
    text: 'noDigital',
    color: tw`text-error-main`.color,
  },
] as const

export const KeepPhraseSecure = (): ReactElement => (
  <View style={tw`w-full`}>
    <Text style={tw`subtitle-1 text-center`}>{i18n(translationsPath + 'toRestore')}</Text>
    <Text style={tw`h6 text-center mt-[45px]`}>{i18n(translationsPath + 'keepSecure')}</Text>
    {items.map(({ id, text, color }) => (
      <View key={id} style={tw`flex-row items-center mt-6`}>
        <Icon id={id} style={tw`w-11 h-11`} color={color} />
        <Text style={tw`body-m pl-4 flex-1`}>{i18n(translationsPath + text)}</Text>
      </View>
    ))}
  </View>
)
