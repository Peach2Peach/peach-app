/* eslint-disable max-lines-per-function */
import React, { ReactElement, useContext, useRef, useState } from 'react'
import {
  Image,
  Keyboard,
  Pressable,
  TextInput,
  View
} from 'react-native'

import tw from '../../styles/tailwind'
import { account, createAccount, deleteAccount, saveAccount, updateSettings } from '../../utils/account'
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


export default ({ navigation }: Props): ReactElement => {
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [isPristine, setIsPristine] = useState(true)
  const [loading, setLoading] = useState(false)
  let $passwordRepeat = useRef<TextInput>(null).current

  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const { validate, isFieldInError } = useValidation({
    deviceLocale: 'default',
    state: { password },
    rules,
    messages: getMessages()
  })

  const checkPasswordMatch = () => {
    if (password && passwordRepeat) {
      setPasswordMatch(password === passwordRepeat)
      return password === passwordRepeat
    }
    return true
  }

  const onPasswordChange = (value: string) => {
    setPassword(value)

    if (!isPristine) {
      checkPasswordMatch()
      validate({
        password: {
          required: true,
          password: true,
        }
      })
    }
  }

  const onError = (e: Error) => {
    error('Error', e)
    updateMessage({
      msg: i18n('AUTHENTICATION_FAILURE'),
      level: 'ERROR',
    })
    deleteAccount({
      onSuccess: () => {
        setLoading(false)
      },
      onError: () => {
        setLoading(false)
      }
    })
  }

  const onPasswordRepeatChange = (value: string) => {
    setPasswordRepeat(value)

    if (!isPristine) {
      checkPasswordMatch()
      validate({
        password: {
          required: true,
          password: true,
        }
      })
    }
  }

  const focusToPasswordRepeat = () => $passwordRepeat?.focus()

  const onSuccess = async () => {
    updateSettings({
      skipTutorial: true
    })

    try {
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
      navigation.navigate('home', {})
    } catch (e) {
      onError(e as Error)
    }
  }

  const submit = () => {
    const isValid = validate({
      password: {
        required: true,
        password: true,
      }
    })
    setIsPristine(false)
    const pwMatch = checkPasswordMatch()
    if (pwMatch && isValid) {
      setLoading(isValid)
      Keyboard.dismiss()
      createAccount({ password, onSuccess, onError })
    }
  }

  return <View style={tw`h-full flex px-6`}>
    <View style={[
      tw`h-full flex-shrink p-6 pt-32 flex-col items-center justify-between`,
      tw.md`pt-36`
    ]}>
      <Image source={require('../../../assets/favico/peach-logo.png')}
        style={[tw`flex-shrink max-h-40`, { resizeMode: 'contain', minHeight: 48 }]}
      />
      <View style={tw`w-full mt-2`}>
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
            <Text style={tw`mt-1 text-center`}>
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
        <View>
          <Text style={[
            tw`font-baloo text-2xs text-grey-3 text-center`,
            !passwordMatch || isFieldInError('password') ? tw`text-red` : {}
          ]}>
            {!passwordMatch
              ? i18n('form.password.match.error')
              : i18n('form.password.error')
            }
          </Text>
          <Input
            onChange={onPasswordChange}
            onSubmit={focusToPasswordRepeat}
            secureTextEntry={true}
            value={password}
            isValid={!isPristine && !isFieldInError('password') && passwordMatch}
            errorMessage={!passwordMatch || isFieldInError('password') ? [''] : []}
          />
        </View>
        <View style={tw`mt-2 h-12`}>
          <Input
            reference={(el: any) => $passwordRepeat = el}
            onChange={onPasswordRepeatChange}
            onSubmit={(val: string) => {
              onPasswordRepeatChange(val)
              submit()
            }}
            secureTextEntry={true}
            value={passwordRepeat}
            isValid={!isPristine && !isFieldInError('passwordRepeat') && passwordMatch}
            errorMessage={!passwordMatch || isFieldInError('passwordRepeat') ? [''] : []}
          />
        </View>
        <View style={tw`w-full mt-5 flex items-center`}>
          <Pressable style={tw`absolute left-0`} onPress={() => navigation.navigate('welcome', {})}>
            <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
          </Pressable>
          <Button
            onPress={submit}
            wide={false}
            disabled={!password || !passwordMatch || isFieldInError('password') || isFieldInError('passwordRepeat')}
            title={i18n('createAccount')}
          />
        </View>
      </View>
      : null
    }
  </View>
}