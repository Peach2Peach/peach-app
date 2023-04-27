import { useCallback, useEffect, useState } from 'react'

import { useNavigation, useRoute } from '../../../hooks'
import { userUpdate } from '../../../init/userUpdate'
import { account, createAccount, deleteAccount, updateAccount } from '../../../utils/account'
import { storeAccount } from '../../../utils/account/storeAccount'
import { signMessageWithPrivateKey } from '../../../utils/crypto/signMessageWithPrivateKey'
import { register } from '../../../utils/peachAPI'
import { getAuthenticationChallenge } from '../../../utils/peachAPI/getAuthenticationChallenge'
import { parseError } from '../../../utils/result'
import { useNewUserHeader } from './useNewUserHeader'

// eslint-disable-next-line max-lines-per-function
export const useNewUserSetup = () => {
  const route = useRoute<'newUser'>()
  const navigation = useNavigation()

  const [success, setSuccess] = useState(false)
  const [newAccount, setNewAccount] = useState<Account>()
  const [userExistsForDevice, setUserExistsForDevice] = useState(false)
  const [error, setError] = useState('')

  useNewUserHeader({ hideUserActions: !userExistsForDevice && !error })

  const onError = useCallback((err?: string) => {
    const errorMsg = err || 'UNKNOWN_ERROR'
    setError(errorMsg)
    deleteAccount()
  }, [])

  const finishRegistration = useCallback(async () => {
    if (!newAccount) {
      onError('ACCOUNT_NOT_SET')
      return
    }
    await updateAccount(newAccount, true)

    storeAccount(account)
    setSuccess(true)

    setTimeout(() => {
      navigation.replace('home')
    }, 1500)
  }, [navigation, newAccount, onError])

  const onSuccess = useCallback(async () => {
    const message = getAuthenticationChallenge()
    const signature = signMessageWithPrivateKey(message, account.privKey!)
    const [result, authError] = await register({
      publicKey: account.publicKey,
      message,
      signature,
    })
    if (!result || authError) {
      onError(authError?.error)
      return
    }

    await userUpdate(route.params.referralCode)

    if (result.restored) {
      setUserExistsForDevice(true)
      return
    }
    await finishRegistration()
  }, [route.params.referralCode, finishRegistration, onError])

  useEffect(() => {
    // creating an account is CPU intensive and causing iOS to show a black bg upon hiding keyboard
    setTimeout(async () => {
      try {
        setNewAccount(await createAccount())
        onSuccess()
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
