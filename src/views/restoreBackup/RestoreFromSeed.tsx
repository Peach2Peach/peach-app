import React, { ReactElement, useContext, useState } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import { Input, Loading, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import Icon from '../../components/Icon'
import { MessageContext } from '../../contexts/message'
import { useNavigation, useValidatedState } from '../../hooks'
import tw from '../../styles/tailwind'
import { createAccount, recoverAccount } from '../../utils/account'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import Restored from './Restored'

const bip39Rules = {
  required: true,
  bip39: true,
}

export default ({ style }: ComponentProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const navigation = useNavigation()
  const seedPhrase: ReturnType<typeof useValidatedState>[] = []

  for (let i = 12; i > 0; i--) {
    seedPhrase.push(useValidatedState('' as string, bip39Rules))
  }

  const [loading, setLoading] = useState(false)
  const [restored, setRestored] = useState(false)
  const onError = (e: Error) => {
    updateMessage({
      msgKey: e.message === 'AUTHENTICATION_FAILURE' ? e.message : 'form.password.invalid',
      level: 'ERROR',
    })
  }

  const validate = () => seedPhrase.every(([word]) => word)
  const formIsValid = validate()

  const submit = async () => {
    Keyboard.dismiss()
    setLoading(true)

    if (!validate()) return

    const mnemonic = seedPhrase.map(([word]) => word).join(' ')
    const recoveredAccount = await createAccount(mnemonic)

    const [success, recoverAccountErr] = await recoverAccount(recoveredAccount)

    if (success) {
      await storeAccount(recoveredAccount)
      setRestored(true)
    } else {
      onError(recoverAccountErr as Error)
    }
    setLoading(false)
  }

  const mapSeedWordToInput
    = (offset: number) =>
      ([word, setWord, isValid]: ReturnType<typeof useValidatedState>, i: number) =>
        (
          <View key={i} style={tw`mt-2`}>
            <Input
              onChange={(val: string) => setWord(val)}
              onSubmit={(val: string) => setWord(val)}
              isValid={isValid}
              secureTextEntry={false}
              placeholder={`${i + 1 + offset}.`}
              value={word}
            />
          </View>
        )

  return (
    <View style={[tw`flex flex-col`, style]}>
      {restored ? (
        <Restored />
      ) : !loading ? (
        <View style={tw`h-full pb-8 flex justify-between`}>
          <View style={tw`h-full flex-shrink flex justify-center items-center`}>
            <Text style={tw`text-center`}>{i18n('restoreBackup.seedPhrase.useBackupFile')}</Text>
            <Text style={tw`mt-6 text-center`}>{i18n('restoreBackup.seedPhrase.enter')}</Text>
            <View style={tw`flex flex-row`}>
              <View style={tw`w-1/2 pr-1`}>
                {seedPhrase.slice(0, 6).map((word, i) => mapSeedWordToInput(0)(word, i))}
              </View>
              <View style={tw`w-1/2 pl-1`}>
                {seedPhrase.slice(6, 12).map((word, i) => mapSeedWordToInput(6)(word, i))}
              </View>
            </View>
          </View>
          <View style={tw`w-full mt-5 flex items-center`}>
            <Pressable style={tw`absolute left-0`} onPress={() => navigation.replace('welcome', {})}>
              <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
            </Pressable>
            <PrimaryButton onPress={submit} disabled={!formIsValid} narrow>
              {i18n('restoreBackup')}
            </PrimaryButton>
          </View>
        </View>
      ) : (
        <View style={tw`h-1/2`}>
          <Loading />
        </View>
      )}
    </View>
  )
}
