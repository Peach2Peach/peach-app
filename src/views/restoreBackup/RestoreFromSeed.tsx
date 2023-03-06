import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { Fade, PeachScrollView, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { MessageContext } from '../../contexts/message'
import { useKeyboard, useNavigation, useValidatedState } from '../../hooks'
import tw from '../../styles/tailwind'
import { createAccount, deleteAccount, recoverAccount } from '../../utils/account'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import { auth } from '../../utils/peachAPI'
import { parseError } from '../../utils/system'
import RestoreBackupError from './RestoreBackupError'
import RestoreBackupLoading from './RestoreBackupLoading'
import RestoreSuccess from './RestoreSuccess'
import { SeedPhraseInput } from './SeedPhraseInput'

export const bip39WordRules = {
  requiredShort: true,
  bip39Word: true,
}
const bip39Rules = {
  required: true,
  bip39: true,
}

export default ({ style }: ComponentProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const keyboardOpen = useKeyboard()
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

  const submit = async () => {
    Keyboard.dismiss()
    setLoading(true)

    if (!isMnemonicValid) return

    const recoveredAccount = await createAccount(mnemonic)

    const [, authError] = await auth({})
    if (authError) {
      onError(authError.error)
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

  if (loading) return <RestoreBackupLoading />
  if (error) return <RestoreBackupError err={error} />
  if (restored) return <RestoreSuccess />
  return (
    <View style={[tw`flex flex-col px-6`, style]}>
      <View style={tw`h-full pb-8`}>
        <PeachScrollView style={tw`flex-shrink h-full`}>
          <Text style={tw`mt-3 text-center text-primary-background-light`}>
            {i18n('restoreBackup.seedPhrase.useBackupFile')}
          </Text>
          <Text style={tw`mt-6 text-center subtitle-1 text-primary-background-light`}>
            {i18n('restoreBackup.seedPhrase.enter')}
          </Text>
          <View style={tw`flex flex-row px-6 mt-4`}>
            <View style={tw`w-1/2 pr-2`}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <SeedPhraseInput key={`seedPhraseInput-${index}`} {...{ index, setWords }} />
              ))}
            </View>
            <View style={tw`w-1/2 pl-2`}>
              {[6, 7, 8, 9, 10, 11].map((index) => (
                <SeedPhraseInput key={`seedPhraseInput-${index}`} {...{ index, setWords }} />
              ))}
            </View>
          </View>
          {allWordsAreSet && !isMnemonicValid && (
            <Text style={[tw`mt-2 text-center tooltip text-primary-background-light`]}>{i18n('form.bip39.error')}</Text>
          )}
        </PeachScrollView>
        <Fade show={!keyboardOpen} style={tw`flex items-center`}>
          <PrimaryButton onPress={submit} disabled={!isMnemonicValid} white iconId="save">
            {i18n('restoreBackup')}
          </PrimaryButton>
        </Fade>
      </View>
    </View>
  )
}
