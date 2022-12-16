import React, { ReactElement, useContext, useState } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Button, FileInput, Input, Loading, Text } from '../../components'
import Icon from '../../components/Icon'
import { MessageContext } from '../../contexts/message'
import { useNavigation, useValidatedState } from '../../hooks'
import { deleteAccount, recoverAccount } from '../../utils/account'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import Restored from './Restored'
import { decryptAccount } from '../../utils/account/decryptAccount'
import { auth } from '../../utils/peachAPI'
import { parseError } from '../../utils/system'

const passwordRules = { required: true, password: true }

export default ({ style }: ComponentProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const navigation = useNavigation()
  const [file, setFile] = useState({
    name: '',
    content: '',
  })

  const [password, setPassword, passwordIsValid] = useValidatedState<string>('', passwordRules)
  const [loading, setLoading] = useState(false)
  const [restored, setRestored] = useState(false)

  const onError = (e?: string) => {
    const errorMsg = e || 'UNKNOWN_ERROR'
    updateMessage({
      msgKey: errorMsg,
      level: 'ERROR',
    })
    deleteAccount({})
  }
  const onPasswordChange = (value: string) => {
    setPassword(value)
  }

  const submit = async () => {
    Keyboard.dismiss()
    setLoading(true)

    const [recoveredAccount] = await decryptAccount({
      encryptedAccount: file.content,
      password,
    })

    if (!recoveredAccount) {
      onError('WRONG_PASSWORD')
      setLoading(false)
      return
    }

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
    } else {
      onError(parseError(recoverAccountErr))
    }
    setLoading(false)
  }

  return (
    <View style={[tw`flex flex-col`, style]}>
      {restored ? (
        <Restored />
      ) : !loading ? (
        <View style={tw`h-full pb-8 flex flex-col justify-between flex-shrink`}>
          <View style={tw`h-full w-full flex-shrink flex flex-col justify-center`}>
            <Text style={tw`mt-4 text-center`}>{i18n('restoreBackup.manual.description.1')}</Text>
            <View style={tw`w-full mt-2`}>
              <FileInput fileName={file.name} style={tw`w-full`} onChange={setFile} />
            </View>
            <View style={tw`mt-2`}>
              <Input
                onChange={setPassword}
                onSubmit={(val: string) => {
                  onPasswordChange(val)
                  if (file.name) submit()
                }}
                secureTextEntry={true}
                placeholder={i18n('restoreBackup.decrypt.password')}
                value={password}
                isValid={passwordIsValid}
                errorMessage={!passwordIsValid ? [i18n('form.password.error')] : []}
              />
            </View>
          </View>
          <View style={tw`w-full mt-5 flex items-center`}>
            <Pressable style={tw`absolute left-0`} onPress={() => navigation.replace('welcome', {})}>
              <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
            </Pressable>
            <Button onPress={submit} disabled={!file.content || !password} wide={false} title={i18n('restoreBackup')} />
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
