import React, { ReactElement, useContext, useState } from 'react'
import { Image, Keyboard, Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Button, FileInput, Input, Loading, Text } from '../../components'
import Icon from '../../components/Icon'
import LanguageContext from '../../contexts/language'
import { recoverAccount, saveAccount, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { StackNavigation } from '../../utils/navigation'
import { getMessages, rules } from '../../utils/validation'
import Logo from '../../assets/logo/peachLogo.svg'

const { LinearGradient } = require('react-native-gradients')
const { useValidation } = require('react-native-form-validator')

type ManualProps = {
  navigation: StackNavigation;
  onSuccess: (account: Account) => void,
  onError: (err: Error) => void,
}
// eslint-disable-next-line max-lines-per-function
export default ({ navigation, onSuccess, onError }: ManualProps): ReactElement => {
  useContext(LanguageContext)
  const [file, setFile] = useState({
    name: '',
    content: ''
  })
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
        password: true,
      }
    })
  }

  const submit = async () => {
    Keyboard.dismiss()
    setLoading(true)

    const [recoveredAccount, err] = await recoverAccount({
      encryptedAccount: file.content,
      password
    })

    if (recoveredAccount) {
      recoveredAccount.settings.skipTutorial = false
      await updateSettings({
        skipTutorial: true
      })
      await saveAccount(recoveredAccount, password)
      onSuccess(recoveredAccount)
    } else {
      onError(err as Error)
    }
    setLoading(false)
  }

  return <View style={tw`h-full flex`}>
    <View style={[
      tw`h-full flex-shrink py-6 pt-32 flex-col items-center`,
      tw.md`pt-36`
    ]}>
      <View style={tw`h-full flex-shrink flex-col items-center justify-end`}>
        <Logo style={[tw`flex-shrink max-w-full w-96 max-h-96 h-full`, { minHeight: 48 }]} />
      </View>
      <View style={[tw`mt-11 w-full`, tw.md`mt-14`]}>
        <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>
          {i18n('restoreBackup')}
        </Text>
        {loading
          ? <View style={tw`h-1/2`}>
            <Loading />
          </View>
          : <View>
            <Text style={tw`mt-4 text-center`}>
              {i18n('restoreBackup.manual.description.1')}
            </Text>
          </View>
        }
      </View>
    </View>
    {!loading
      ? <View style={tw`pb-8 mt-4 flex items-center w-full bg-white-1`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <View style={tw`w-full`}>
          <FileInput
            fileName={file.name}
            style={tw`w-full`}
            onChange={setFile}
          />
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
            isValid={!isFieldInError('password')}
            errorMessage={isFieldInError('password') ? [i18n('form.password.error')] : []}
          />
        </View>
        <View style={tw`w-full mt-5 flex items-center`}>
          <Pressable style={tw`absolute left-0`} onPress={() => navigation.replace('welcome', {})}>
            <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
          </Pressable>
          <Button
            onPress={submit}
            disabled={!file.content || !password}
            wide={false}
            title={i18n('restoreBackup')}
          />
        </View>
      </View>
      : null
    }
  </View>
}