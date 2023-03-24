import { useMemo } from 'react'
import { Linking } from 'react-native'
import { DISCORD, TELEGRAM } from '../../../constants'

import { useHeaderSetup, useNavigation } from '../../../hooks'
import { account } from '../../../utils/account'
import i18n from '../../../utils/i18n'

export const contactReasonsNoAccount = ['bug', 'accountLost', 'question', 'sellMore', 'other'] as ContactReason[]
export const contactReasonsWithAccount = ['bug', 'userProblem', 'sellMore', 'other'] as ContactReason[]

export const useContactSetup = () => {
  const navigation = useNavigation()

  useHeaderSetup(useMemo(() => ({ title: i18n('contact.title') }), []))

  const setReason = (reason: ContactReason) => {
    navigation.navigate('report', { reason, shareDeviceID: reason === 'accountLost' })
  }

  const openTelegram = () => Linking.openURL(TELEGRAM)
  const openDiscord = () => Linking.openURL(DISCORD)

  return {
    contactReasons: account?.publicKey ? contactReasonsWithAccount : contactReasonsNoAccount,
    setReason,
    openTelegram,
    openDiscord,
  }
}
