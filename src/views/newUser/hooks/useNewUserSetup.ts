import { useCallback, useEffect, useState } from 'react'

import { useHeaderSetup, useNavigation, useRoute } from '../../../hooks'
import { userUpdate } from '../../../init/userUpdate'
import { account, createAccount, deleteAccount, updateAccount } from '../../../utils/account'
import { storeAccount } from '../../../utils/account/storeAccount'
import i18n from '../../../utils/i18n'
import { auth } from '../../../utils/peachAPI'
import { parseError } from '../../../utils/result'

const headerConfig = { title: i18n('welcome.welcomeToPeach.title'), hideGoBackButton: true, theme: 'inverted' as const }

export const useNewUserSetup = () => {
  useHeaderSetup(headerConfig)
  const route = useRoute<'newUser'>()
  const navigation = useNavigation()

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const onError = useCallback((err?: string) => {
    const errorMsg = err || 'UNKNOWN_ERROR'
    setError(errorMsg)
    deleteAccount()
  }, [])

  const onSuccess = useCallback(async () => {
    const [result, authError] = await auth({})
    if (result) {
      await userUpdate(route.params.referralCode)
      storeAccount(account)
      setSuccess(true)

      setTimeout(() => {
        navigation.replace('home')
      }, 1500)
    } else {
      onError(authError?.error)
    }
  }, [navigation, onError, route.params.referralCode])

  useEffect(() => {
    // creating an account is CPU intensive and causing iOS to show a black bg upon hiding keyboard
    setTimeout(async () => {
      try {
        await updateAccount(await createAccount(), true)
        onSuccess()
      } catch (e) {
        onError(parseError(e))
      }
    })
  }, [onError, onSuccess])

  return { success, error }
}
