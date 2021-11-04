/* eslint-disable max-lines-per-function */
import React, { ReactElement, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { backupAccount, createAccount, decryptAccount, getAccount, recoverAccount } from '../../utils/accountUtils'
import { StackNavigationProp } from '@react-navigation/stack'
import { Button, FileData, FileInput, Input, Text } from '../../components'
import i18n from '../../utils/i18n'
import { getMessages, rules } from '../../utils/validationUtils'

const { useValidation } = require('react-native-form-validator')

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AccountTest'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  const [password, setPassword] = useState('')
  const [file, setFile] = useState({
    name: '',
    content: ''
  })
  // eslint-disable-next-line prefer-const
  let [account, setAccount] = useState(null)


  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { account },
    rules,
    messages: getMessages()
  })

  const onPasswordChange = (value: string) => {
    setPassword(value)
    if (!file.content) return

    account = decryptAccount(file.content, value)
    setAccount(account)
    validate({
      account: {
        account: true,
      },
    })
  }
  const onFileChange = (result: FileData) => {
    setFile(result)
    account = decryptAccount(result.content, password)
    setAccount(account)
    validate({
      account: {
        account: true,
      },
    })
  }
  const onSuccess = () => {
    // eslint-disable-next-line no-console
    console.log('success')
  }

  const onError = () => {
    // eslint-disable-next-line no-console
    console.log('error')
  }
  return <ScrollView>
    <View style={tw`flex-col justify-center h-full`}>
      <View style={tw`mt-4`}>
        <Input
          label="Password"
          onChange={setPassword}
          onSubmit={onPasswordChange}
          secureTextEntry={true}
        />
      </View>
      <View style={tw`mt-4`}>
        <Text>{password}</Text>
        <Button
          onPress={() => createAccount({ account: null, password, onSuccess, onError })}
          title="Create account"
        />
      </View>
      <View style={tw`mt-4`}>
        <Button
          onPress={() => getAccount(password)}
          title="Get account"
        />
      </View>
      <View style={tw`mt-4`}>
        <Button
          onPress={backupAccount}
          title="Backup account"
        />
      </View>
      <View style={tw`mt-4 flex flex-col items-center`}>
        <Text style={tw`text-xs`}>Name: {file.name}</Text>
        <Text style={tw`text-xs`}>Account: {JSON.stringify(account)}</Text>
        <Text style={tw`text-xs`}>!isFieldInError('account'): {!isFieldInError('account')}</Text>
        <FileInput
          fileName={file.name}
          style={tw`w-48`}
          onChange={onFileChange}
          isValid={!isFieldInError('account')}
          errorMessage={getErrorsInField('account')}
        />
      </View>
      <View style={tw`mt-1 flex items-center`}>
        <Button
          onPress={() => recoverAccount({
            encryptedAccount: file.content,
            password,
            onSuccess,
            onError
          })}
          wide={false}
          title={i18n('restoreBackup')}
        />
      </View>
      <View style={tw`mt-4`}>
        <Button
          onPress={() => navigation.goBack()}
          secondary={true}
          title="Back"
        />
      </View>
    </View>
  </ScrollView>
}