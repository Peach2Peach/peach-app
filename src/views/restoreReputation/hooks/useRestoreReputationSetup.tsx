import { useState } from 'react'
import { useNavigation, useRoute } from '../../../hooks'
import { useOnboardingHeader } from '../../../hooks/headers/useOnboardingHeader'
import { useTemporaryAccount } from '../../../hooks/useTemporaryAccount'
import { userUpdate } from '../../../init/userUpdate'
import { storeAccount, updateAccount } from '../../../utils/account'
import i18n from '../../../utils/i18n'

export const useRestoreReputationSetup = () => {
  const route = useRoute<'restoreReputation'>()
  const navigation = useNavigation()
  const [isRestored, setIsRestored] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { temporaryAccount } = useTemporaryAccount()

  useOnboardingHeader({
    title: i18n('restoreBackup.restoreReputation'),
    icons: isLoading ? [] : undefined,
    hideGoBackButton: isLoading,
  })

  const restoreReputation = () => {
    if (!temporaryAccount) return
    setIsLoading(true)
    // prevent render blocking
    setTimeout(async () => {
      await updateAccount(temporaryAccount, true)
      await userUpdate(route.params.referralCode)

      storeAccount(temporaryAccount)
      setIsRestored(true)

      setTimeout(() => {
        navigation.replace('buy')
      }, 1500)
    })
  }

  return { restoreReputation, isLoading, isRestored }
}
