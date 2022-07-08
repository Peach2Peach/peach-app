/* eslint-disable max-lines-per-function */
import React, { ReactElement, useContext, useState } from 'react'
import {
  Image,
  Keyboard,
  Pressable, View
} from 'react-native'

import { StackNavigationProp } from '@react-navigation/stack'
import { Button, Input, Loading, Text } from '../../components'
import Icon from '../../components/Icon'
import { MessageContext } from '../../contexts/message'
import tw from '../../styles/tailwind'
import { loadAccount } from '../../utils/account'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { getMessages, rules } from '../../utils/validation'
import { getPeachInfo } from '../../init/session'
import { setSession } from '../../utils/session'
const { LinearGradient } = require('react-native-gradients')

const { useValidation } = require('react-native-form-validator')

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'login'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}


export default ({ navigation }: Props): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { validate, isFieldInError } = useValidation({
    deviceLocale: 'default',
    state: { password },
    rules,
    messages: getMessages()
  })

  const submit = async () => {
    const isValid = validate({
      password: {
        required: true
      }
    })
    if (isValid) {
      Keyboard.dismiss()
      setLoading(isValid)

      const loadedAccount = await loadAccount(password)
      if (loadedAccount?.publicKey) {
        await setSession({ password })
        await getPeachInfo(loadedAccount)
        navigation.replace('home', {})
      } else {
        updateMessage({ msg: i18n('form.password.invalid'), level: 'ERROR' })
      }

      setLoading(false)
    }
  }

  return <View style={tw`h-full flex justify-center px-6`}>
    <View style={tw`h-full flex-shrink p-6 flex-col items-center justify-between`}>
      <View />{/* dummy for layout */}
      <Image source={require('../../../assets/favico/peach-logo.png')}
        style={[tw`flex-shrink max-h-40`, { resizeMode: 'contain', minHeight: 48 }]}
      />
      <View style={tw`w-full`}>
        <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>
          {i18n('login.title')}
        </Text>
        {loading
          ? <View style={tw`h-1/2`}>
            <Loading />
          </View>
          : <View>
            <Text style={tw`mt-4 text-center`}>
              {i18n('login.description.1')}
            </Text>
          </View>
        }
      </View>
      <View />{/* dummy for layout */}
    </View>
    {!loading
      ? <View style={tw`pb-8 mt-4 flex items-center w-full bg-white-1`}>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        <View>
          <Input
            label={i18n('form.password')}
            onChange={setPassword}
            onSubmit={submit}
            secureTextEntry={true}
            value={password}
            isValid={!isFieldInError('password')}
            errorMessage={isFieldInError('password') ? [''] : []}
          />
        </View>
        <View style={tw`w-full mt-5 flex items-center`}>
          <Pressable style={tw`absolute left-0`} onPress={() => navigation.replace('welcome', {})}>
            <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
          </Pressable>
          <Button
            onPress={submit}
            wide={false}
            disabled={!password}
            title={i18n('login')}
          />
        </View>
      </View>
      : null
    }
  </View>
}