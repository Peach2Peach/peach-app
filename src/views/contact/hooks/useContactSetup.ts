import { useMemo } from 'react'
import { Linking } from 'react-native'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import i18n from '../../../utils/i18n'

export const useContactSetup = () => {
  const navigation = useNavigation()

  useHeaderSetup(useMemo(() => ({ title: i18n('contact.title') }), []))

  const setReason = (reason: ContactReason) => {
    navigation.navigate('report', { reason })
  }

  const openTelegram = () => Linking.openURL('https://t.me/+3KpdrMw25xBhNGJk')
  const openDiscord = () => Linking.openURL('https://discord.gg/skP9zqTB')

  return { setReason, openTelegram, openDiscord }
}
