import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Headline, PeachScrollView } from '../../components'
import i18n from '../../utils/i18n'
import { SettingsItem } from './components/SettingsItem'
import { VersionInfo } from './components/VersionInfo'
import { useSettingsSetup } from './useSettingsSetup'

export default (): ReactElement => {
  const settings = useSettingsSetup()

  return (
    <PeachScrollView contentContainerStyle={tw`pt-12`}>
      {settings.map(({ headline, items }) => (
        <View key={`settings-${headline}`} style={tw`mx-8`}>
          {headline && (
            <Headline style={tw`text-left h6 text-primary-light mt-9 mb-3 lowercase`}>
              {i18n(`settings.${headline}`)}
            </Headline>
          )}
          {items.map((item, i) => (
            <SettingsItem key={`${headline}-${item.title}-${i}`} {...item} />
          ))}
        </View>
      ))}
      <VersionInfo style={tw`mt-9 mb-10 text-center`} />
    </PeachScrollView>
  )
}
