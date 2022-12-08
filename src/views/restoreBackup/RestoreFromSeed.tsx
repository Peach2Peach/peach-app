import React, { Dispatch, ReactElement, SetStateAction, useContext, useState } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { Button, Input, Loading, Text } from '../../components'
import Icon from '../../components/Icon'
import { MessageContext } from '../../contexts/message'
import { useNavigation } from '../../hooks'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import Restored from './Restored'
import { createAccount, recoverAccount } from '../../utils/account'

export default ({ style }: ComponentProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const navigation = useNavigation()
  const seedPhrase: [string, Dispatch<SetStateAction<string>>][] = []

  for (let i = 12; i > 0; i--) {
    seedPhrase.push(useState(''))
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
  const isValid = validate()

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

  return (
    <View style={[tw`flex flex-col`, style]}>
      {restored ? (
        <Restored />
      ) : !loading ? (
        <View style={tw`pb-8 flex items-center w-full bg-white-1`}>
          <Text style={tw`text-center`}>{i18n('restoreBackup.seedPhrase.useBackupFile')}</Text>
          <Text style={tw`mt-6 text-center`}>{i18n('restoreBackup.seedPhrase.enter')}</Text>
          <View style={tw`flex flex-row`}>
            <View style={tw`w-1/2 pr-1`}>
              {seedPhrase.slice(0, 6).map(([word, setWord], i) => (
                <View key={i} style={tw`mt-2`}>
                  <Input
                    onChange={(val: string) => setWord(val)}
                    onSubmit={(val: string) => setWord(val)}
                    secureTextEntry={false}
                    placeholder={`${i + 1}.`}
                    value={word}
                  />
                </View>
              ))}
            </View>
            <View style={tw`w-1/2 pl-1`}>
              {seedPhrase.slice(6, 12).map(([word, setWord], i) => (
                <View key={i} style={tw`mt-2`}>
                  <Input
                    onChange={(val: string) => setWord(val)}
                    onSubmit={(val: string) => setWord(val)}
                    secureTextEntry={false}
                    placeholder={`${i + 7}.`}
                    value={word}
                  />
                </View>
              ))}
            </View>
          </View>
          <View style={tw`w-full mt-5 flex items-center`}>
            <Pressable style={tw`absolute left-0`} onPress={() => navigation.replace('welcome', {})}>
              <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
            </Pressable>
            <Button onPress={submit} disabled={!isValid} wide={false} title={i18n('restoreBackup')} />
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
