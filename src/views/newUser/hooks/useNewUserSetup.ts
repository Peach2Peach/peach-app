import { useCallback, useEffect, useState } from 'react'

import { useNavigation, useRoute } from '../../../hooks'
import { useOnboardingHeader } from '../../../hooks/headers/useOnboardingHeader'
import { useTemporaryAccount } from '../../../hooks/useTemporaryAccount'
import { userUpdate } from '../../../init/userUpdate'
import { createAccount, deleteAccount, signMessageWithAccount, updateAccount } from '../../../utils/account'
import { storeAccount } from '../../../utils/account/storeAccount'
import i18n from '../../../utils/i18n'
import { register } from '../../../utils/peachAPI'
import { getAuthenticationChallenge } from '../../../utils/peachAPI/getAuthenticationChallenge'
import { parseError } from '../../../utils/result'

// eslint-disable-next-line max-lines-per-function
export const useNewUserSetup = () => {
  const route = useRoute<'newUser'>()
  const navigation = useNavigation()

  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const { setTemporaryAccount } = useTemporaryAccount()
  const [userExistsForDevice, setUserExistsForDevice] = useState(false)
  const [error, setError] = useState('')

  useOnboardingHeader({
    title: i18n('welcome.welcomeToPeach.title'),
    hideGoBackButton: !success || userExistsForDevice || !!error,
    icons: isLoading ? [] : undefined,
  })

  const onError = useCallback((err?: string) => {
    const errorMsg = err || 'UNKNOWN_ERROR'
    setError(errorMsg)
    deleteAccount()
  }, [])

  const finishRegistration = useCallback(
    async (account: Account) => {
      await updateAccount(account, true)
      await userUpdate(route.params.referralCode)

      storeAccount(account)
      setSuccess(true)

      setTimeout(() => {
        navigation.replace('buy')
      }, 1500)
    },
    [navigation, route.params.referralCode],
  )

  const onSuccess = useCallback(
    async (account: Account & { mnemonic: string; base58: string }) => {
      const message = getAuthenticationChallenge()

      const [result, authError] = await register({
        publicKey: account.publicKey,
        message,
        signature: signMessageWithAccount(message, account),
      })

      if (!result || authError) {
        onError(authError?.error)
        return
      }

      if (result.restored) {
        setTemporaryAccount(account)
        setUserExistsForDevice(true)
        return
      }
      finishRegistration(account)
    },
    [finishRegistration, onError, setTemporaryAccount],
  )

  useEffect(() => {
    // creating an account is CPU intensive and causing iOS to show a black bg upon hiding keyboard
    setTimeout(async () => {
      try {
        await onSuccess(await createAccount())
      } catch (e) {
        onError(parseError(e))
      }
      setIsLoading(false)
    })
  }, [onError, onSuccess])

  return {
    success,
    error,
    userExistsForDevice,
  }
}
