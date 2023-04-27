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

  const [isLoading, setIsloading] = useState(true)
  const [success, setSuccess] = useState(false)
  const { setTemporaryAccount } = useTemporaryAccount()
  const [userExistsForDevice, setUserExistsForDevice] = useState(false)
  const [error, setError] = useState('')

  useOnboardingHeader({
    title: i18n('welcome.welcomeToPeach.title'),
    hideGoBackButton: !success || userExistsForDevice || !!error,
    icons: !isLoading ? [] : undefined,
  })

  const onError = useCallback((err?: string) => {
    const errorMsg = err || 'UNKNOWN_ERROR'
    setError(errorMsg)
    deleteAccount()
  }, [])

  const finishRegistration = useCallback(
    async (account: Account) => {
      await updateAccount(account, true)

      storeAccount(account)
      setSuccess(true)

      setTimeout(() => {
        navigation.replace('home')
      }, 1500)
    },
    [navigation],
  )

  const onSuccess = useCallback(
    async (account: Account) => {
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

      await userUpdate(route.params.referralCode)

      if (result.restored) {
        setTemporaryAccount(account)
        setUserExistsForDevice(true)
        return
      }
      await finishRegistration(account)
    },
    [route.params.referralCode, finishRegistration, onError, setTemporaryAccount],
  )

  useEffect(() => {
    // creating an account is CPU intensive and causing iOS to show a black bg upon hiding keyboard
    setTimeout(async () => {
      try {
        onSuccess(await createAccount())
      } catch (e) {
        onError(parseError(e))
      }
      setIsloading(false)
    })
  }, [onError, onSuccess])

  return {
    success,
    error,
    userExistsForDevice,
  }
}
