import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { Fade, Input, PeachScrollView, Text } from '../../components'
import { useBackgroundState } from '../../components/background/backgroundStore'
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

const bip39WordRules = {
  required: true,
  bip39Word: true,
}
const bip39Rules = {
  required: true,
  bip39: true,
}

export default ({ style }: ComponentProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const setBackgroundState = useBackgroundState((state) => state.setBackgroundState)
  const keyboardOpen = useKeyboard()
  const navigation = useNavigation()

  const seedPhrase: ReturnType<typeof useValidatedState>[] = []
  const [mnemonic, setMnemonic, isMnemonicValid] = useValidatedState('' as string, bip39Rules)

  for (let i = 12; i > 0; i--) {
    seedPhrase.push(useValidatedState('' as string, bip39WordRules))
  }

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [restored, setRestored] = useState(false)

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

  const allWordsSet = () => seedPhrase.every(([word]) => word)
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
        setBackgroundState({
          color: undefined,
        })
      }, 1500)
    } else {
      setLoading(false)
      onError(parseError(recoverAccountErr))
    }
  }

  const mapSeedWordToInput
    = (offset: number) =>
      ([word, setWord, , errorMessage]: ReturnType<typeof useValidatedState>, i: number) =>
        (
          <Input
            {...{
              key: i,
              theme: 'inverted',
              onChange: setWord,
              onSubmit: setWord,
              errorMessage,
              placeholder: `${i + 1 + offset}.`,
              value: word,
            }}
          />
        )

  useEffect(() => {
    setMnemonic(seedPhrase.map(([word]) => word).join(' '))
  }, [seedPhrase, setMnemonic])

  if (loading) return <RestoreBackupLoading />
  if (error) return <RestoreBackupError err={error} />
  if (restored) return <RestoreSuccess />
  return (
    <View style={[tw`flex flex-col px-6`, style]}>
      <View style={tw`h-full pb-8`}>
        <PeachScrollView style={tw`h-full flex-shrink`}>
          <Text style={tw`text-center text-primary-background-light mt-3`}>
            {i18n('restoreBackup.seedPhrase.useBackupFile')}
          </Text>
          <Text style={tw`subtitle-1 mt-6 text-center text-primary-background-light`}>
            {i18n('restoreBackup.seedPhrase.enter')}
          </Text>
          <View style={tw`flex flex-row px-6 mt-4`}>
            <View style={tw`w-1/2 pr-2`}>{seedPhrase.slice(0, 6).map((word, i) => mapSeedWordToInput(0)(word, i))}</View>
            <View style={tw`w-1/2 pl-2`}>
              {seedPhrase.slice(6, 12).map((word, i) => mapSeedWordToInput(6)(word, i))}
            </View>
          </View>
          {allWordsSet() && !isMnemonicValid && (
            <Text style={[tw`tooltip text-center text-primary-background-light mt-2`]}>{i18n('form.bip39.error')}</Text>
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
