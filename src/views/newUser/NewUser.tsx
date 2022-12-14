import { RouteProp } from '@react-navigation/native'
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useBackgroundState } from '../../components/background/backgroundStore'

import { MessageContext } from '../../contexts/message'
import { useHeaderSetup } from '../../hooks'
import userUpdate from '../../init/userUpdate'
import { account, createAccount, deleteAccount } from '../../utils/account'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import { auth } from '../../utils/peachAPI'
import { parseError } from '../../utils/system'
import CreateAccountError from './CreateAccountError'
import CreateAccountLoading from './CreateAccountLoading'
import CreateAccountSuccess from './CreateAccountSuccess'

type Props = {
  route: RouteProp<{ params: RootStackParamList['newUser'] }>
  navigation: StackNavigation
}

export default ({ route, navigation }: Props): ReactElement => {
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('welcome.welcomeToPeach.title'),
        hideGoBackButton: true,
        theme: 'inverted',
      }),
      [],
    ),
  )
  const [, updateMessage] = useContext(MessageContext)
  const setBackgroundState = useBackgroundState((state) => state.setBackgroundState)

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const onError = useCallback(
    (err?: string) => {
      const errorMsg = err || 'UNKNOWN_ERROR'
      setError(errorMsg)
      if (err !== 'REGISTRATION_DENIED') {
        updateMessage({
          msgKey: err || errorMsg,
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
        setBackgroundState({
          color: undefined,
        })
      }, 1500)
    } else {
      onError(authError?.error)
    }
  }, [navigation, onError, route.params.referralCode, setBackgroundState])

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
