import { useState } from 'react'
import { useNavigation } from '../../../hooks'
import { useOnboardingHeader } from '../../../hooks/headers/useOnboardingHeader'
import { useTemporaryAccount } from '../../../hooks/useTemporaryAccount'
import { storeAccount, updateAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'

export const useRestoreReputationSetup = () => {
  const navigation = useNavigation()
  const [isRestored, setIsRestored] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { temporaryAccount } = useTemporaryAccount()

  useOnboardingHeader({
    title: i18n('restoreBackup.restoreReputation'),
    icons: isLoading ? [] : undefined,
    hideGoBackButton: isLoading,
  })

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
