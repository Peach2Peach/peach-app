import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'

import { MessageContext } from '../../contexts/message'
import { useHeaderSetup, useNavigation, useRoute } from '../../hooks'
import userUpdate from '../../init/userUpdate'
import { account, createAccount, deleteAccount } from '../../utils/account'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import { auth } from '../../utils/peachAPI'
import { parseError } from '../../utils/system'
import CreateAccountError from './CreateAccountError'
import CreateAccountLoading from './CreateAccountLoading'
import CreateAccountSuccess from './CreateAccountSuccess'

const headerConfig = { title: i18n('welcome.welcomeToPeach.title'), hideGoBackButton: true, theme: 'inverted' as const }

export default (): ReactElement => {
  useHeaderSetup(headerConfig)
  const route = useRoute<'newUser'>()
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const onError = useCallback(
    (err?: string) => {
      const errorMsg = err || 'UNKNOWN_ERROR'
      setError(errorMsg)
      if (errorMsg !== 'REGISTRATION_DENIED') {
        updateMessage({
          msgKey: errorMsg,
          level: 'ERROR',
        })
      }
      deleteAccount()
    },
    [updateMessage],
  )

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
        await createAccount()
        onSuccess()
      } catch (e) {
        onError(parseError(e))
      }
    })
  }, [onError, onSuccess])

  if (success) return <CreateAccountSuccess />
  if (error) return <CreateAccountError err={error} />

  return <CreateAccountLoading />
}
