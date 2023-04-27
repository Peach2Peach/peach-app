import { useCallback, useEffect, useState } from 'react'

import { useNavigation, useRoute } from '../../../hooks'
import { userUpdate } from '../../../init/userUpdate'
import { createAccount, deleteAccount, signMessageWithAccount, updateAccount } from '../../../utils/account'
import { storeAccount } from '../../../utils/account/storeAccount'
import { register } from '../../../utils/peachAPI'
import { getAuthenticationChallenge } from '../../../utils/peachAPI/getAuthenticationChallenge'
import { parseError } from '../../../utils/result'
import { useNewUserHeader } from './useNewUserHeader'
import { useTemporaryAccount } from '../../../hooks/useTemporaryAccount'

// eslint-disable-next-line max-lines-per-function
export const useNewUserSetup = () => {
  const route = useRoute<'newUser'>()
  const navigation = useNavigation()

  const [success, setSuccess] = useState(false)
  const { setTemporaryAccount } = useTemporaryAccount()
  const [userExistsForDevice, setUserExistsForDevice] = useState(false)
  const [error, setError] = useState('')

  useNewUserHeader({ hideUserActions: !userExistsForDevice && !error })

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
    })
  }, [onError, onSuccess])

  return {
    success,
    error,
    userExistsForDevice,
  }
}
