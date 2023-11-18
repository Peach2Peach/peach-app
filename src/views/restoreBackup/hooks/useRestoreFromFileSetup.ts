import { useState } from 'react'
import { Keyboard } from 'react-native'
import { useValidatedState } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { deleteAccount, recoverAccount } from '../../../utils/account'
import { useAccountStore } from '../../../utils/account/account'
import { decryptAccount } from '../../../utils/account/decryptAccount'
import { storeAccount } from '../../../utils/account/storeAccount'
import { parseError } from '../../../utils/result'
import { setupPeachAccount } from './setupPeachAccount'

const passwordRules = { password: true, required: true }

export const useRestoreFromFileSetup = () => {
  const [file, setFile] = useState({
    name: '',
    content: '',
  })

  const [password, setPassword, , passwordError] = useValidatedState<string>('', passwordRules)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [restored, setRestored] = useState(false)

  const updateFileBackupDate = useSettingsStore((state) => state.updateFileBackupDate)
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn)

  const onError = (errorMsg = 'UNKNOWN_ERROR') => {
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

    const authErr = await setupPeachAccount(recoveredAccount)

    if (authErr) {
      setLoading(false)
      onError(authErr)
      return
    }
    const updatedAccount = await recoverAccount(recoveredAccount)

    if (recoveredAccount.paymentData) recoveredAccount.paymentData.map(usePaymentDataStore.getState().addPaymentData)

    await storeAccount(updatedAccount)
    setRestored(true)
    setLoading(false)
    updateFileBackupDate()

    setTimeout(() => {
      setIsLoggedIn(true)
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
