import React, { ReactElement, useCallback, useContext, useState } from 'react'
import { Keyboard, View } from 'react-native'
import tw from '../../styles/tailwind'

import { FileInput, Input, Text } from '../../components'
import { PrimaryButton } from '../../components/buttons'
import { MessageContext } from '../../contexts/message'
import { useNavigation, useValidatedState } from '../../hooks'
import { deleteAccount, recoverAccount } from '../../utils/account'
import { decryptAccount } from '../../utils/account/decryptAccount'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import { auth } from '../../utils/peachAPI'
import { parseError } from '../../utils/system'
import RestoreBackupError from './RestoreBackupError'
import RestoreBackupLoading from './RestoreBackupLoading'
import RestoreSuccess from './RestoreSuccess'

const passwordRules = { password: true, required: true }

export default ({ style }: ComponentProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const navigation = useNavigation()

  const [file, setFile] = useState({
    name: '',
    content: '',
  })

  const [password, setPassword, , passwordError] = useValidatedState<string>('', passwordRules)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [restored, setRestored] = useState(false)

  const onError = useCallback(
    (err?: string) => {
      const errorMsg = err || 'UNKNOWN_ERROR'
      if (errorMsg !== 'WRONG_PASSWORD') setError(errorMsg)
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

    const [recoveredAccount, err] = await decryptAccount({
      encryptedAccount: file.content,
      password,
    })

    if (!recoveredAccount) {
      setLoading(false)
      onError(parseError(err))
      return
    }

    const [, authErr] = await auth({})
    if (authErr) {
      onError(authErr.error)
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
      <View style={tw`flex flex-col justify-between flex-shrink h-full`}>
        <View style={tw`flex flex-col justify-center flex-shrink w-full h-full`}>
          <Text style={tw`mt-4 text-center subtitle-1 text-primary-background-light`}>
            {i18n('restoreBackup.manual.description.1')}
          </Text>
          <View style={tw`w-full px-2 mt-2`}>
            <FileInput
              theme="inverted"
              fileName={file.name}
              placeholder={i18n('restoreBackup.decrypt.file')}
              onChange={setFile}
            />
          </View>
          <View style={tw`px-2`}>
            <Input
              theme="inverted"
              onChange={setPassword}
              onSubmit={(val: string) => {
                setPassword(val)
                if (file.name) submit()
              }}
              secureTextEntry={true}
              placeholder={i18n('restoreBackup.decrypt.password')}
              value={password}
              errorMessage={passwordError}
            />
          </View>
        </View>
        <View style={tw`flex items-center pb-8`}>
          <PrimaryButton onPress={submit} disabled={!file.content || !password} white iconId="save">
            {i18n('restoreBackup')}
          </PrimaryButton>
        </View>
      </View>
    </View>
  )
}
