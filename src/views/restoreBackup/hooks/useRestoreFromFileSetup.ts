import { useState } from 'react'
import { Keyboard } from 'react-native'

import { useNavigation, useValidatedState } from '../../../hooks'
import { deleteAccount, recoverAccount } from '../../../utils/account'
import { decryptAccount } from '../../../utils/account/decryptAccount'
import { storeAccount } from '../../../utils/account/storeAccount'
import { auth } from '../../../utils/peachAPI'
import { parseError } from '../../../utils/result'
import { setPeachAccount } from '../../../utils/peachAPI/peachAccount'
import { createPeachAccount } from '../../../utils/account/createPeachAccount'

const passwordRules = { password: true, required: true }

export const useRestoreFromFileSetup = () => {
  const navigation = useNavigation()

  const [file, setFile] = useState({
    name: '',
    content: '',
  })

  const [password, setPassword, , passwordError] = useValidatedState<string>('', passwordRules)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [restored, setRestored] = useState(false)

  const onError = (err?: string) => {
    const errorMsg = err || 'UNKNOWN_ERROR'
    if (errorMsg !== 'WRONG_PASSWORD') setError(errorMsg)
    deleteAccount()
  }

  const submit = async () => {
    Keyboard.dismiss()
    setLoading(true)

    const [recoveredAccount, err] = await decryptAccount({
      encryptedAccount: file.content,
      password,
    })

    if (!recoveredAccount || !recoveredAccount.mnemonic) {
      setLoading(false)
      onError(parseError(err))
      return
    }

    setPeachAccount(createPeachAccount(recoveredAccount.mnemonic))

    const [, authErr] = await auth({})
    if (authErr) {
      onError(authErr.error)
      setLoading(false)
      return
    }
    const updatedAccount = await recoverAccount(recoveredAccount)

    await storeAccount(updatedAccount)
    setRestored(true)
    setLoading(false)

    setTimeout(() => {
      navigation.replace('home')
    }, 1500)
  }

  return { restored, error, loading, file, setFile, password, setPassword, passwordError, submit }
}
