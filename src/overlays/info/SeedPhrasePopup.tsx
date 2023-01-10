import React from 'react'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

const translationsPath = 'settings.backups.seedPhrase.popup.text.'
export const SeedPhrasePopup = () => (
  <Text style={tw`body-m`}>
    {i18n(translationsPath + '1')}
    {'\n\n'}
    <Text style={tw`font-bold`}>{i18n(translationsPath + '2')}</Text>
  </Text>
)
