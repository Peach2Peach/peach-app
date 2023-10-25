import { useCallback, useMemo, useState } from 'react'
import { Keyboard } from 'react-native'
import { useMessageState } from '../../../components/message/useMessageState'
import { useNavigation, useValidatedState } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { createAccount, deleteAccount, recoverAccount } from '../../../utils/account'
import { createPeachAccount } from '../../../utils/account/createPeachAccount'
import { loadWalletFromAccount } from '../../../utils/account/loadWalletFromAccount'
import { storeAccount } from '../../../utils/account/storeAccount'
import { auth } from '../../../utils/peachAPI'
import { setPeachAccount } from '../../../utils/peachAPI/peachAccount'

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
  const navigation = useNavigation()
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

  const createAndRecover = async () => {
    const recoveredAccount = await createAccount(mnemonic)
    const wallet = loadWalletFromAccount(recoveredAccount)
    setPeachAccount(createPeachAccount(wallet))

    const [, authError] = await auth({})
    if (authError) {
      onError(authError.error)
      setLoading(false)
      return
    }
    const updatedAccount = await recoverAccount(recoveredAccount)

    await storeAccount(updatedAccount)
    setRestored(true)
    setLoading(false)
    updateSeedBackupDate()

    setTimeout(() => {
      navigation.replace('buy')
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
