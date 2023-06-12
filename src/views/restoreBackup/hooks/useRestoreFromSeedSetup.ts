import { useCallback, useContext, useMemo, useState } from 'react'
import { Keyboard } from 'react-native'
import { MessageContext } from '../../../contexts/message'
import { useNavigation, useValidatedState } from '../../../hooks'
import { createAccount, deleteAccount, recoverAccount } from '../../../utils/account'
import { createPeachAccount } from '../../../utils/account/createPeachAccount'
import { loadWalletFromAccount } from '../../../utils/account/loadWalletFromAccount'
import { storeAccount } from '../../../utils/account/storeAccount'
import { auth } from '../../../utils/peachAPI'
import { setPeachAccount } from '../../../utils/peachAPI/peachAccount'

export const bip39WordRules = {
  requiredShort: true,
  bip39Word: true,
}
const bip39Rules = {
  required: true,
  bip39: true,
}

export const useRestoreFromSeedSetup = () => {
  const [, updateMessage] = useContext(MessageContext)
  const navigation = useNavigation()

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

    setTimeout(() => {
      navigation.replace('home')
    }, 1500)
  }

  const submit = async () => {
    Keyboard.dismiss()
    setLoading(true)

    if (!isMnemonicValid) return

    // creation a new account is render blocking, to show loading, we call it within a timeout
    setTimeout(createAndRecover)
  }
  return { restored, error, loading, setWords, allWordsAreSet, isMnemonicValid, submit }
}
