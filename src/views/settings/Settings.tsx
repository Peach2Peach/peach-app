import { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { PeachScrollView, Text } from '../../components'
import i18n from '../../utils/i18n'
import { SettingsItem } from './components/SettingsItem'
import { VersionInfo } from './components/VersionInfo'
import { useSettingsSetup } from './hooks/useSettingsSetup'

export default (): ReactElement => {
  const settings = useSettingsSetup()

  return (
    <PeachScrollView contentContainerStyle={tw`pt-12`}>
      {settings.map(({ headline, items }) => (
        <View key={`settings-${headline}`} style={tw`mx-8`}>
          {headline && (
            <Text style={tw`mb-3 text-left lowercase h6 text-primary-main mt-9`}>{i18n(`settings.${headline}`)}</Text>
          )}
          {items.map((item, i) => (
            <SettingsItem key={`${headline}-${item.title}-${i}`} {...item} />
          ))}
        </View>
      ))}
      <VersionInfo style={tw`mb-10 text-center mt-9`} />
    </PeachScrollView>
  )
}
