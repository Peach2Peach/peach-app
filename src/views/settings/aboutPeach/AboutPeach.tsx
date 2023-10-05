import { useCallback } from 'react'
import { Linking, ViewStyle } from 'react-native'
import { IconType } from '../../../assets/icons'
import { Header, PeachScrollView, Screen } from '../../../components'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n, { languageState } from '../../../utils/i18n'
import { getLocalizedLink } from '../../../utils/web'
import { SettingsItem } from '../components/SettingsItem'

export const AboutPeach = () => {
  const navigation = useNavigation()

  const items: { title: string; onPress: () => void; icon?: IconType; iconSize?: ViewStyle }[] = [
    {
      title: 'peachFees',
      onPress: useCallback(() => navigation.navigate('peachFees'), [navigation]),
    },
    {
      title: 'socials',
      onPress: useCallback(() => navigation.navigate('socials'), [navigation]),
    },
    {
      title: 'bitcoinProducts',
      onPress: useCallback(() => navigation.navigate('bitcoinProducts'), [navigation]),
    },
    {
      title: 'website',
      onPress: () => Linking.openURL(getLocalizedLink('', languageState.locale)),
      icon: 'externalLink',
      iconSize: tw`w-6 h-6`,
    },
    {
      title: 'privacyPolicy',
      onPress: () => Linking.openURL(getLocalizedLink('privacy-policy', languageState.locale)),
      icon: 'externalLink',
      iconSize: tw`w-6 h-6`,
    },
    {
      title: 'terms',
      onPress: () => Linking.openURL(getLocalizedLink('terms-and-conditions', languageState.locale)),
      icon: 'externalLink',
      iconSize: tw`w-6 h-6`,
    },
  ]

  return (
    <Screen>
      <Header title={i18n('settings.aboutPeach')} />
      <PeachScrollView contentContainerStyle={tw`justify-center flex-1`}>
        {items.map((item) => (
          <SettingsItem
            key={item.title}
            title={item.title}
            onPress={item.onPress}
            iconId={item.icon}
            iconSize={item.iconSize}
          />
        ))}
      </PeachScrollView>
    </Screen>
  )
}
