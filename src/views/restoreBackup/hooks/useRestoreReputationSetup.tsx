import { useMemo, useState } from 'react'
import { Icon } from '../../../components'
import { useHeaderSetup, useNavigation } from '../../../hooks'
import { useTemporaryAccount } from '../../../hooks/useTemporaryAccount'
import tw from '../../../styles/tailwind'
import { storeAccount, updateAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'
import { goToHomepage } from '../../../utils/web'

export const useRestoreReputationSetup = () => {
  const navigation = useNavigation()
  const [isRestored, setIsRestored] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { temporaryAccount } = useTemporaryAccount()

  const headerIcons = useMemo(
    () => [
      {
        iconComponent: <Icon id="mail" color={tw`text-primary-background-light`.color} />,
        onPress: () => navigation.navigate('contact'),
      },
      {
        iconComponent: <Icon id="globe" color={tw`text-primary-background-light`.color} />,
        onPress: goToHomepage,
      },
    ],
    [navigation],
  )
  const headerConfig = useMemo(
    () => ({
      title: i18n('restoreBackup.restoreReputation'),
      icons: headerIcons,
      theme: 'inverted' as const,
    }),
    [headerIcons],
  )
  useHeaderSetup(headerConfig)

  const restoreReputation = async () => {
    if (!temporaryAccount) return
    setIsLoading(true)
    // prevent render blocking
    setTimeout(async () => {
      await updateAccount(temporaryAccount, true)
      storeAccount(temporaryAccount)
      setIsRestored(true)

      setTimeout(() => {
        navigation.replace('home')
      }, 1500)
    })
  }

  return { restoreReputation, isLoading, isRestored }
}
