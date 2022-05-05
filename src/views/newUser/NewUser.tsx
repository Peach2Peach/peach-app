/* eslint-disable max-lines-per-function */
import React, { ReactElement, useContext, useState } from 'react'
import {
  Image,
  Keyboard,
  Pressable,
  View
} from 'react-native'

import tw from '../../styles/tailwind'
import { account, createAccount, saveAccount, updateSettings } from '../../utils/account'
import { StackNavigationProp } from '@react-navigation/stack'
import { Button, Input, Loading, Text } from '../../components'
import i18n from '../../utils/i18n'
import { getMessages, rules } from '../../utils/validation'
import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import Icon from '../../components/Icon'
import { error, info } from '../../utils/log'
import { setPGP } from '../../utils/peachAPI'
const { LinearGradient } = require('react-native-gradients')
import { whiteGradient } from '../../utils/layout'

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
    updateSettings({
      skipTutorial: true
    })
    const [result, err] = await setPGP(account.pgp)

    if (result) {
      info('Set PGP for user', account.publicKey)
      updateSettings({
        pgpPublished: true
      })
    } else {
      error('PGP could not be set', err)
    }
    saveAccount(account, password)

    setLoading(false)
    navigation.replace('home', {})
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
    setLoading(isValid)
    if (isValid) {
      Keyboard.dismiss()
      createAccount({ password, onSuccess, onError })
    }
  }

  return <View style={tw`h-full flex px-6`}>
    <View style={[
      tw`h-full flex-shrink p-6 pt-32 flex-col items-center`,
      tw.md`pt-36`
    ]}>
      <Image source={require('../../../assets/favico/peach-logo.png')}
        style={[tw`h-24`, tw.md`h-32`, { resizeMode: 'contain' }]}
      />
      <View style={[tw`mt-11 w-full`, tw.md`mt-14`]}>
        <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>
          {i18n(loading ? 'newUser.title.create' : 'newUser.title.new')}
        </Text>
        {loading
          ? <View style={tw`h-1/2`}>
            <Loading />
          </View>
          : <View>
            <Text style={tw`mt-4 text-center`}>
              {i18n('newUser.description.1')}
            </Text>
            <Text style={tw`mt-7 text-center`}>
              {i18n('newUser.description.2')}
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
        <View style={tw`h-12`}>
          <Input
            onChange={onPasswordChange}
            onSubmit={(val: string) => {
              onPasswordChange(val)
              submit()
            }}
            secureTextEntry={true}
            value={password}
            isValid={!isPristine && !isFieldInError('password')}
            hint={i18n('form.password.error')}
            errorMessage={isFieldInError('password') ? [i18n('form.password.error')] : []}
          />
        </View>
        <View style={tw`w-full mt-5 flex items-center`}>
          <Pressable style={tw`absolute left-0`} onPress={() => navigation.goBack()}>
            <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
          </Pressable>
          <Button
            onPress={submit}
            wide={false}
            title={i18n('createAccount')}
          />
        </View>
      </View>
      : null
    }
  </View>
}