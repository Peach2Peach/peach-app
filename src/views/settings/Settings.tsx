import { View } from 'react-native'
import { Header } from '../../components/Header'
import { PeachScrollView } from '../../components/PeachScrollView'
import { Screen } from '../../components/Screen'
import { PeachText } from '../../components/text/PeachText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { SettingsItem } from './components/SettingsItem'
import { VersionInfo } from './components/VersionInfo'
import { useSettingsSetup } from './hooks/useSettingsSetup'

export const Settings = () => {
  const settings = useSettingsSetup()

  return (
    <Screen header={<Header title={i18n('settings.title')} hideGoBackButton />}>
      <PeachScrollView>
        {settings.map(({ headline, items }) => (
          <View key={`settings-${headline}`}>
            {headline && (
              <PeachText style={tw`mb-3 text-left lowercase h6 text-primary-main mt-9`}>
                {i18n(`settings.${headline}`)}
              </PeachText>
            )}
            {items.map((item, i) => {
              const props = typeof item === 'string' ? { title: item } : item
              return <SettingsItem key={`${headline}-${typeof item === 'string' ? item : item.title}-${i}`} {...props} />
            })}
          </View>
        ))}
        <VersionInfo style={tw`mb-10 text-center mt-9`} />
      </PeachScrollView>
    </Screen>
  )
}
