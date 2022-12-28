import React, { ReactElement, useCallback } from 'react'
import { Linking, ViewStyle } from 'react-native'
import { IconType } from '../../../assets/icons'
import { PeachScrollView } from '../../../components'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { SettingsItem } from '../components/SettingsItem'

export default (): ReactElement => {
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
    <PeachScrollView contentContainerStyle={tw`px-8 flex-1 justify-center`}>
      {items.map((item, i) => (
        <SettingsItem title={item.title} onPress={item.onPress} iconId={item.icon} iconSize={item.iconSize} />
      ))}
    </PeachScrollView>
  )
}
