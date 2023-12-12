import { useCallback, useMemo, useState } from 'react'
import { Keyboard } from 'react-native'
import { useMessageState } from '../../../components/message/useMessageState'
import { useValidatedState } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { useAccountStore } from '../../../utils/account/account'
import { createAccount } from '../../../utils/account/createAccount'
import { deleteAccount } from '../../../utils/account/deleteAccount'
import { recoverAccount } from '../../../utils/account/recoverAccount'
import { storeAccount } from '../../../utils/account/storeAccount'
import { setupPeachAccount } from './setupPeachAccount'

export const bip39WordRules = {
  required: true,
  bip39Word: true,
}
const bip39Rules = {
  required: true,
  bip39: true,
}

export const useRestoreFromSeedSetup = () => {
  const updateMessage = useMessageState((state) => state.updateMessage)
  const updateSeedBackupDate = useSettingsStore((state) => state.updateSeedBackupDate)

  const [words, setWords] = useState<string[]>(new Array(12).fill(''))
  const [mnemonic, setMnemonic, isMnemonicValid] = useValidatedState<string>('', bip39Rules)
  const allWordsAreSet = useMemo(() => {
    const allSet = words.every((word) => !!word)
    if (allSet) {
      setMnemonic(words.join(' '))
    }
    return allSet
  }, [setMnemonic, words])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [restored, setRestored] = useState(false)
  const setIsLoggedIn = useAccountStore((state) => state.setIsLoggedIn)

  const onError = useCallback(
    (errorMsg = 'UNKNOWN_ERROR') => {
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

  const createAndRecover = async () => {
    const recoveredAccount = await createAccount(mnemonic)

    const authError = await setupPeachAccount(recoveredAccount)

    if (authError) {
      onError(authError)
      setLoading(false)
      return
    }
    const updatedAccount = await recoverAccount(recoveredAccount)

    await storeAccount(updatedAccount)
    setRestored(true)
    setLoading(false)
    updateSeedBackupDate()

    setTimeout(() => {
      setIsLoggedIn(true)
    }, 1500)
  }

  const submit = () => {
    Keyboard.dismiss()
    setLoading(true)

    if (!isMnemonicValid) return

    // creation a new account is render blocking, to show loading, we call it within a timeout
    setTimeout(createAndRecover)
  }
  return { restored, error, loading, setWords, allWordsAreSet, isMnemonicValid, submit }
}
