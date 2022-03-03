import React, { Dispatch, ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Input, Text } from '../../components'
import i18n from '../../utils/i18n'
import { account, recoverAccount, saveAccount } from '../../utils/accountUtils'
import { getMessages, rules } from '../../utils/validationUtils'

const { useValidation } = require('react-native-form-validator')

type DecryptProps = {
  encryptedAccount: string,
  onSuccess: () => void,
  onError: () => void
}
export default ({ encryptedAccount, onSuccess, onError }: DecryptProps): ReactElement => {
  useContext(LanguageContext)
  const [password, setPassword] = useState('')

  const { validate, isFieldInError } = useValidation({
    deviceLocale: 'default',
    state: { password },
    rules,
    messages: getMessages()
  })

  const onPasswordChange = (value: string) => {
    setPassword(value)

    validate({
      password: {
        required: true,
      }
    })
  }

  const submit = async () => {
    await recoverAccount({
      encryptedAccount,
      password,
      onSuccess,
      onError
    })
    saveAccount(account, password)
  }

  return <View>
    <Text style={[tw`font-baloo text-center text-3xl leading-3xl text-peach-1`, tw.md`text-5xl`]}>
      {i18n('restoreBackup')}
    </Text>
    <Text style={tw`mt-4 text-center`}>
      {i18n('restoreBackup.decrypt.description.1')}
    </Text>
    <View style={tw`mt-4`}>
      <Input
        onChange={setPassword}
        onSubmit={onPasswordChange}
        secureTextEntry={true}
        value={password}
        isValid={!isFieldInError('password')}
        errorMessage={isFieldInError('password') ? [i18n('form.password.error')] : []}
      />
    </View>
    <View style={tw`mt-4 flex items-center`}>
      <Button
        onPress={submit}
        wide={false}
        title={i18n('decrypt')}
      />
    </View>
  </View>
}