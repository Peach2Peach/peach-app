import { useCallback, useContext, useState } from 'react'
import { Keyboard } from 'react-native'

import { MessageContext } from '../../../contexts/message'
import { useNavigation, useValidatedState } from '../../../hooks'
import { deleteAccount, recoverAccount } from '../../../utils/account'
import { decryptAccount } from '../../../utils/account/decryptAccount'
import { storeAccount } from '../../../utils/account/storeAccount'
import { auth } from '../../../utils/peachAPI'
import { parseError } from '../../../utils/system'

const passwordRules = { password: true, required: true }

export const useRestoreFromFileSetup = () => {
  const [, updateMessage] = useContext(MessageContext)
  const navigation = useNavigation()

  const [file, setFile] = useState({
    name: '',
    content: '',
  })

  const [password, setPassword, , passwordError] = useValidatedState<string>('', passwordRules)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [restored, setRestored] = useState(false)

  const onError = useCallback(
    (err?: string) => {
      const errorMsg = err || 'UNKNOWN_ERROR'
      if (errorMsg !== 'WRONG_PASSWORD') setError(errorMsg)
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

  const submit = async () => {
    Keyboard.dismiss()
    setLoading(true)

    const [recoveredAccount, err] = await decryptAccount({
      encryptedAccount: file.content,
      password,
    })

    if (!recoveredAccount) {
      setLoading(false)
      onError(parseError(err))
      return
    }

    const [, authErr] = await auth({})
    if (authErr) {
      onError(authErr.error)
      setLoading(false)
      return
    }
    const [success, recoverAccountErr] = await recoverAccount(recoveredAccount)

    if (success) {
      await storeAccount(recoveredAccount)
      setRestored(true)
      setLoading(false)

      setTimeout(() => {
        navigation.replace('home')
      }, 1500)
    } else {
      setLoading(false)
      onError(parseError(recoverAccountErr))
    }
  }

  return { restored, error, loading, file, setFile, password, setPassword, passwordError, submit }
}
