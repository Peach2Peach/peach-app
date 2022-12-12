import { RouteProp } from '@react-navigation/native'
import React, { ReactElement, useCallback, useContext, useEffect } from 'react'
import { View } from 'react-native'
import Logo from '../../assets/logo/peachLogo.svg'
import { Loading, Text } from '../../components'

import LanguageContext from '../../contexts/language'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import userUpdate from '../../init/userUpdate'
import tw from '../../styles/tailwind'
import { createAccount, deleteAccount } from '../../utils/account'
import { storeAccount } from '../../utils/account/storeAccount'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import { auth } from '../../utils/peachAPI'
import { useAccountStore } from '../../utils/storage/accountStorage'
import { parseError } from '../../utils/system'

type Props = {
  route: RouteProp<{ params: RootStackParamList['newUser'] }>
  navigation: StackNavigation
}

// eslint-disable-next-line complexity
export default ({ route, navigation }: Props): ReactElement => {
  const account = useAccountStore()
  const [, updateOverlay] = useContext(OverlayContext)

  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const onError = useCallback(
    (err?: string) => {
      updateMessage({
        msgKey: err || 'AUTHENTICATION_FAILURE',
        level: 'ERROR',
      })
      if (err === 'REGISTRATION_DENIED') navigation.replace('welcome', {})
      deleteAccount({
        onSuccess: () => {
          updateOverlay({ content: null })
        },
      })
      navigation.goBack()
    },
    [navigation, updateMessage, updateOverlay],
  )

  const onSuccess = useCallback(async () => {
    try {
      const [result, authError] = await auth({})
      if (result) {
        await userUpdate(account, route.params.referralCode)
        storeAccount(account)

        navigation.replace('home', {})
      } else {
        onError(authError?.error)
      }
    } catch (e) {
      onError(parseError(e))
    }
  }, [navigation, onError, route.params.referralCode])

  useEffect(() => {
    // creating an account is CPU intensive and causing iOS to show a black bg upon hiding keyboard
    setTimeout(async () => {
      try {
        await createAccount()
        onSuccess()
      } catch (e) {
        onError(parseError(e))
      }
    })
  }, [onError, onSuccess])

  return (
    <View style={tw`h-full flex justify-center px-6`}>
      <View style={tw`h-full flex-shrink p-6 flex-col items-center justify-between`}>
        <View />
        {/* dummy for layout */}
        <View style={tw`h-full flex-shrink flex-col items-center justify-end mt-10 pb-10`}>
          <Logo style={[tw`flex-shrink max-w-full w-96 max-h-96 h-full`, { minHeight: 48 }]} />
        </View>
        <View style={tw`w-full`}>
          <Text style={tw`font-baloo text-center text-3xl leading-3xl text-peach-1`}>
            {i18n('newUser.title.create')}
          </Text>
          <View style={tw`h-1/2`}>
            <Loading />
          </View>
        </View>
        <View />
        {/* dummy for layout */}
      </View>
    </View>
  )
}
