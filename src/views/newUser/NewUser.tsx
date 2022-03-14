/* eslint-disable max-lines-per-function */
import React, { ReactElement, useContext, useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  View
} from 'react-native'
const { LinearGradient } = require('react-native-gradients')

import tw from '../../styles/tailwind'
import { account, createAccount, saveAccount } from '../../utils/account'
import { StackNavigationProp } from '@react-navigation/stack'
import { Button, Input, Text } from '../../components'
import i18n from '../../utils/i18n'
import { getMessages, rules } from '../../utils/validation'
import { whiteGradient } from '../../utils/layout'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { MessageContext } from '../../utils/message'
import Icon from '../../components/Icon'
import { error } from '../../utils/log'
import { setPGP } from '../../utils/peachAPI'

const { useValidation } = require('react-native-form-validator')

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'newUser'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}


// TODO add loading animation on submit
export default ({ navigation }: Props): ReactElement => {
  const [password, setPassword] = useState('')
  const [isPristine, setIsPristine] = useState(true)
  const [loading, setLoading] = useState(false)

  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const { validate, isFieldInError } = useValidation({
    deviceLocale: 'default',
    state: { password },
    rules,
    messages: getMessages()
  })

  const onPasswordChange = (value: string) => {
    setPassword(value)

    if (!isPristine) {
      validate({
        password: {
          required: true,
          password: true,
        }
      })
    }
  }

  const onSuccess = async () => {
    saveAccount(account, password)
    await setPGP(account.pgp)
    setLoading(false)
    navigation.navigate('tutorial')
  }

  const onError = (e: string) => {
    setLoading(false)
    error('Error', e)
    updateMessage({
      msg: i18n('error.createAccount'),
      level: 'ERROR',
    })
  }

  const submit = () => {
    const isValid = validate({
      password: {
        required: true,
        password: true,
      }
    })
    setIsPristine(false)
    setLoading(true)
    if (isValid) {
      createAccount({ password, onSuccess, onError })
    }
  }

  return <View style={tw`h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <View style={tw`w-full h-8 mt-32 -mb-8 z-10`}>
        <LinearGradient colorList={whiteGradient} angle={-90} />
      </View>
      <ScrollView>
        <View style={tw`pb-8`}>
          <View style={tw`flex items-center`}>
            <Image source={require('../../../assets/favico/peach-icon-192.png')} />
          </View>
          <Text style={[tw`font-baloo text-center text-3xl leading-3xl text-peach-1`, tw.md`text-5xl`]}>
            {i18n('newUser.title')}
          </Text>
          <Text style={tw`mt-4 text-center`}>
            {i18n('newUser.description.1')}
          </Text>
          <Text style={tw`mt-7 text-center`}>
            {i18n('newUser.description.2')}
          </Text>
          <View style={tw`mt-2`}>
            <Input
              onChange={onPasswordChange}
              onSubmit={onPasswordChange}
              secureTextEntry={true}
              value={password}
              isValid={!isPristine && !isFieldInError('password')}
              errorMessage={isFieldInError('password') ? [i18n('form.password.error')] : []}
            />
          </View>
          <View style={tw`mt-4 flex items-center`}>
            <Pressable style={tw`absolute left-0`} onPress={() => navigation.goBack()}>
              <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
            </Pressable>
            <Button
              onPress={submit}
              disabled={loading}
              wide={false}
              title={i18n('createAccount')}
            />
          </View>
        </View>
      </ScrollView>
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
    </View>
  </View>
}