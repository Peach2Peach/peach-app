import React, { ReactElement, useCallback } from 'react'
import { Linking, ViewStyle } from 'react-native'
import { IconType } from '../../../assets/icons'
import { PeachScrollView } from '../../../components'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { SettingsItem } from '../components/SettingsItem'

export default (): ReactElement => {
  const navigation = useNavigation()
  useHeaderSetup({ title: i18n('settings.aboutPeach') })

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
      onPress: () => Linking.openURL('https://peachbitcoin.com/'),
      icon: 'externalLink',
      iconSize: tw`w-6 h-6`,
    },
    {
      title: 'privacyPolicy',
      onPress: () => Linking.openURL('https://peachbitcoin.com/privacyPolicy.html'),
      icon: 'externalLink',
      iconSize: tw`w-6 h-6`,
    },
    {
      title: 'terms',
      onPress: () => Linking.openURL('https://peachbitcoin.com/termsConditions.html'),
      icon: 'externalLink',
      iconSize: tw`w-6 h-6`,
    },
  ]

  return (
    <PeachScrollView contentContainerStyle={tw`justify-center flex-1 px-8`}>
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
  )
}
