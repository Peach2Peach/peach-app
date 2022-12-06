import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Keyboard, Pressable, View } from 'react-native'

import Logo from '../../assets/logo/peachLogo.svg'
import { Button, Input, Loading, Text } from '../../components'
import Icon from '../../components/Icon'
import AppContext from '../../contexts/app'
import { MessageContext } from '../../contexts/message'
import { getPeachInfo, getTrades } from '../../init/session'
import tw from '../../styles/tailwind'
import { loadAccount } from '../../utils/account'
import { getChatNotifications } from '../../utils/chat'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { error } from '../../utils/log'
import { StackNavigation } from '../../utils/navigation'
import { getRequiredActionCount } from '../../utils/offer'
import { setSessionItem } from '../../utils/session'
import { useValidatedState } from '../../hooks'
const { LinearGradient } = require('react-native-gradients')

type Props = {
  navigation: StackNavigation
}

const passwordRules = { required: true }

export default ({ navigation }: Props): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const [, updateAppContext] = useContext(AppContext)

  const [password, setPassword, passwordIsValid] = useValidatedState('', passwordRules)
  const [loading, setLoading] = useState(false)
  const [displayErrors, setDisplayErrors] = useState(false)

  const submit = async () => {
    setDisplayErrors(true)
    const isValid = passwordIsValid
    if (isValid) {
      Keyboard.dismiss()
      setLoading(isValid)

      const loadedAccount = await loadAccount(password)
      if (loadedAccount?.publicKey) {
        await setSessionItem('password', password)
        await getPeachInfo(loadedAccount)
        await getTrades()
        updateAppContext({
          notifications: getChatNotifications() + getRequiredActionCount(),
        })
        navigation.replace('home', {})
      } else {
        updateMessage({ msgKey: 'WRONG_PASSWORD', level: 'ERROR' })
      }

      setLoading(false)
    }
  }

  useEffect(() => {
    error(new Error('User ended up in Login screen'))
  }, [])

  return (
    <View style={tw`h-full flex justify-center px-6`}>
      <View style={tw`h-full flex-shrink p-6 flex-col items-center justify-between`}>
        <View />
        {/* dummy for layout */}
        <View style={tw`h-full flex-shrink flex-col items-center justify-end mt-16 pb-10`}>
          <Logo style={[tw`flex-shrink max-w-full w-96 max-h-96 h-full`, { minHeight: 48 }]} />
        </View>
        <View style={tw`w-full`}>
          <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>{i18n('login.title')}</Text>
          {loading ? (
            <View style={tw`w-full items-center`}>
              <Loading />
            </View>
          ) : (
            <View>
              <Text style={tw`mt-4 text-center`}>{i18n('login.description.1')}</Text>
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
            <Input
              label={i18n('form.password')}
              placeholder={i18n('form.password.placeholder')}
              onChange={setPassword}
              onSubmit={submit}
              secureTextEntry={true}
              value={password}
              errorMessage={displayErrors ? (!passwordIsValid ? [''] : []) : undefined}
            />
          </View>
          <View style={tw`w-full mt-5 flex items-center`}>
            <Pressable style={tw`absolute left-0`} onPress={() => navigation.replace('welcome', {})}>
              <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color} />
            </Pressable>
            <Button onPress={submit} wide={false} disabled={!password} title={i18n('login')} />
          </View>
        </View>
      ) : null}
    </View>
  )
}
