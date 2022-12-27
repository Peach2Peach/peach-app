import React, { ReactElement, useCallback } from 'react'
import { PeachScrollView } from '../../../components'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { SettingsItem } from '../components/SettingsItem'

export default (): ReactElement => {
  const navigation = useNavigation()
  const items: { title: string; onPress: () => void }[] = [
    {
      title: 'peachFees',
      onPress: () => {},
    },
    {
      title: 'socials',
      onPress: () => {},
    },
    {
      title: 'bitcoinProducts',
      onPress: useCallback(() => navigation.navigate('bitcoinProducts'), [navigation]),
    },
  ]

  return (
    <PeachScrollView contentContainerStyle={tw`px-8 flex-1 justify-center`}>
      {items.map((item, i) => (
        <SettingsItem title={item.title} onPress={item.onPress} />
      ))}
    </PeachScrollView>
  )
}
