import React, { ReactElement, useContext, useRef, useState } from 'react'
import { Keyboard, Pressable, TextInput, View } from 'react-native'

import Logo from '../../assets/logo/peachLogo.svg'
import { Input, Loading, PrimaryButton, Text } from '../../components'
import Icon from '../../components/Icon'
import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import SaveYourPassword from '../../overlays/SaveYourPassword'
import tw from '../../styles/tailwind'
import { account, createAccount, deleteAccount } from '../../utils/account'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { StackNavigation } from '../../utils/navigation'
import { auth } from '../../utils/peachAPI'
import userUpdate from '../../init/userUpdate'
import { ContactButton } from '../report/components/ContactButton'
import { useValidatedState } from '../../hooks'
const { LinearGradient } = require('react-native-gradients')

type Props = {
  navigation: StackNavigation
}

const passwordRules = { required: true, password: true }
const referralCodeRules = { referralCode: true }

// eslint-disable-next-line complexity
export default ({ navigation }: Props): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [password, setPassword, passwordIsValid] = useValidatedState<string>('', passwordRules)
  const [passwordRepeat, setPasswordRepeat, passwordRepeatIsValid] = useValidatedState<string>('', passwordRules)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [referralCode, setReferralCode, referralCodeIsValid, referralCodeErrors] = useValidatedState<string>(
    '',
    referralCodeRules,
  )
  const [isPristine, setIsPristine] = useState(true)
  const [loading, setLoading] = useState(false)
  const [displayErrors, setDisplayErrors] = useState(false)
  let $passwordRepeat = useRef<TextInput>(null).current
  let $referral = useRef<TextInput>(null).current

  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const validate = () => {
    setDisplayErrors(true)
    return !password || !passwordRepeat || (passwordIsValid && referralCodeIsValid)
  }

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
      validate()
    }
  }

  const onError = (e: Error) => {
    updateMessage({
      msgKey: e.message || 'AUTHENTICATION_FAILURE',
      level: 'ERROR',
      action: () => navigation.navigate('contact', {}),
      actionLabel: i18n('contactUs'),
      actionIcon: 'mail',
    })
    if (e.message === 'REGISTRATION_DENIED') navigation.replace('welcome', {})
    deleteAccount({
      onSuccess: () => {
        setLoading(false)
        updateOverlay({ content: null })
      },
    })
  }

  const onSuccess = async () => {
    try {
      const [result, authError] = await auth({})
      if (result) {
        updateOverlay({ content: <SaveYourPassword />, showCloseButton: false })

        await userUpdate(referralCode)
        storeAccount(account, password)

        setLoading(false)
        navigation.replace('home', {})
      } else {
        onError(new Error(authError?.error))
      }
    } catch (e) {
      onError(e as Error)
    }
  }

  const onPasswordRepeatChange = (value: string) => {
    setPasswordRepeat(value)

    if (!isPristine) {
      checkPasswordMatch()
      validate()
    }
  }

  const focusToPasswordRepeat = () => $passwordRepeat?.focus()

  const submit = () => {
    if (!password || !passwordRepeat || !passwordMatch || !passwordIsValid || !passwordRepeatIsValid) {
      Keyboard.dismiss()
      return
    }
    setIsPristine(false)
    const pwMatch = checkPasswordMatch()
    if (pwMatch && validate()) {
      Keyboard.dismiss()
      setLoading(true)

      // creating an account is CPU intensive and causing iOS to show a black bg upon hiding keyboard
      setTimeout(() => {
        createAccount({ password, onSuccess, onError })
      })
    }
  }

  return (
    <View style={tw`h-full flex justify-center px-6`}>
      <ContactButton style={tw`p-4 absolute top-0 left-0 z-10`} navigation={navigation} />
      <View style={tw`h-full flex-shrink p-6 flex-col items-center justify-between`}>
        <View />
        {/* dummy for layout */}
        <View style={tw`h-full flex-shrink flex-col items-center justify-end mt-10 pb-10`}>
          <Logo style={[tw`flex-shrink max-w-full w-96 max-h-96 h-full`, { minHeight: 48 }]} />
        </View>
        <View style={tw`w-full`}>
          <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>
            {i18n(loading ? 'newUser.title.create' : 'newUser.title.new')}
          </Text>
          {loading ? (
            <View style={tw`h-1/2`}>
              <Loading />
            </View>
          ) : (
            <View>
              <Text style={tw`mt-4 text-center`}>{i18n('newUser.description.1')}</Text>
              <Text style={tw`mt-1 text-center`}>{i18n('newUser.description.2')}</Text>
            </View>
          )}
        </View>
        <View />
        {/* dummy for layout */}
      </View>
      {!loading ? (
        <View style={tw`pb-8 mt-4 flex items-center w-full bg-white-1`}>
          <View style={tw`w-full h-8 -mt-8`}>
            <LinearGradient colorList={whiteGradient} angle={90} />
          </View>
          <View>
            <Text
              style={[
                tw`font-baloo text-2xs text-grey-3 text-center`,
                displayErrors && (!passwordMatch || !passwordIsValid) ? tw`text-red` : {},
              ]}
            >
              {!passwordMatch ? i18n('form.password.match.error') : i18n('form.password.error')}
            </Text>
            <Input
              testID="newUser-password"
              onChange={onPasswordChange}
              onSubmit={focusToPasswordRepeat}
              secureTextEntry={true}
              value={password}
              errorMessage={displayErrors ? (!passwordMatch || !passwordIsValid ? [''] : []) : undefined}
            />
          </View>
          <View style={tw`mt-2 h-12`}>
            <Input
              testID="newUser-passwordRepeat"
              reference={(el: any) => ($passwordRepeat = el)}
              onChange={onPasswordRepeatChange}
              onSubmit={(val: string) => {
                onPasswordRepeatChange(val)
                $referral?.focus()
              }}
              secureTextEntry={true}
              value={passwordRepeat}
              errorMessage={displayErrors ? (!passwordMatch || !passwordRepeatIsValid ? [''] : []) : undefined}
            />
          </View>
          <View style={tw`mt-4 h-12 px-4`}>
            <Text style={tw`font-baloo text-2xs text-grey-3 text-center`}>{i18n('newUser.referralCode')}</Text>
            <Input
              testID="newUser-referralCode"
              reference={(el: any) => ($referral = el)}
              onChange={setReferralCode}
              onSubmit={(val: string) => {
                setReferralCode(val)
                submit()
              }}
              value={referralCode}
              autoCapitalize="characters"
              errorMessage={displayErrors ? referralCodeErrors : undefined}
            />
          </View>
          <View style={tw`w-full mt-10 flex items-center`}>
            <Pressable style={tw`absolute left-0`} onPress={() => navigation.replace('welcome', {})}>
              <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color} />
            </Pressable>
            <PrimaryButton
              testID="newUser-register"
              onPress={submit}
              disabled={!password || !passwordRepeat || !passwordMatch || !passwordIsValid || !passwordRepeatIsValid}
            >
              {i18n('createAccount')}
            </PrimaryButton>
          </View>
        </View>
      ) : null}
    </View>
  )
}
