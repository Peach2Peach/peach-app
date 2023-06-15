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
import { loadWalletFromAccount } from '../../../utils/account/loadWalletFromAccount'

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

  const decryptAndRecover = async () => {
    const [recoveredAccount, err] = decryptAccount({
      encryptedAccount: file.content,
      password,
    })

    if (!recoveredAccount || !recoveredAccount.mnemonic) {
      setLoading(false)
      onError(parseError(err))
      return
    }

    const wallet = loadWalletFromAccount(recoveredAccount)
    setPeachAccount(createPeachAccount(wallet))

    const [, authErr] = await auth({})
    if (authErr) {
      setLoading(false)
      onError(authErr.error)
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

  const submit = () => {
    Keyboard.dismiss()
    setLoading(true)

    // decrypting is render blocking, to show loading, we call it within a timeout
    setTimeout(decryptAndRecover)
  }

  return { restored, error, loading, file, setFile, password, setPassword, passwordError, submit }
}
