import React, { ReactElement, useContext, useState } from 'react'
import {
  Pressable,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Button, Fade, PeachScrollView, Text, Title } from '../../components'
import { account, backupAccount, deleteAccount } from '../../utils/account'
import { API_URL, NETWORK } from '@env'
import { APPVERSION } from '../../constants'
import Clipboard from '@react-native-clipboard/clipboard'
import i18n from '../../utils/i18n'
import Icon from '../../components/Icon'
import { splitAt } from '../../utils/string'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'settings'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [showCopied, setShowCopied] = useState(false)

  const publicKey = splitAt(account.publicKey, Math.floor(account.publicKey.length / 2) - 1).join('\n')
  const copy = () => {
    Clipboard.setString(account.publicKey)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }

  return <View style={tw`h-full pb-32`}>
    <PeachScrollView contentContainerStyle={tw`px-6`}>
      <Title title={'Settings'} />
      <Text style={tw`text-sm text-grey-2`}>
        App version: {APPVERSION}
      </Text>
      <Text style={tw`text-sm text-grey-2`}>API URL: {API_URL}</Text>
      <Text style={tw`text-sm text-grey-2`}>Network: {NETWORK}</Text>
      <Text style={tw`text-sm text-grey-2`}>Your public key:</Text>
      <Pressable onPress={copy} style={tw`flex-row items-center`}>
        <Text style={tw`text-sm text-grey-2`}>{publicKey}</Text>
        <View>
          <Fade show={showCopied} duration={300} delay={0} >
            <Text style={tw`font-baloo text-grey-1 text-sm uppercase absolute -top-6 w-20 left-1/2 -ml-10 text-center`}>
              {i18n('copied')}
            </Text>
          </Fade>
          <Icon id="copy" style={tw`w-7 h-7 ml-2`} color={tw`text-peach-1`.color as string}/>
        </View>
      </Pressable>
      <View style={tw`mt-4`}>
        <Button
          onPress={backupAccount}
          title="Backup account"
        />
      </View>
      <View style={tw`mt-4`}>
        <Button
          onPress={async () => {
            await deleteAccount({
              onSuccess: () => {
                navigation.navigate('welcome', {})
              },
              onError: () => {}
            })
          }}
          title="Delete account"
        />
      </View>
      <View style={tw`mt-4`}>
        <Button
          secondary={true}
          onPress={() => navigation.goBack()}
          title="Back"
        />
      </View>
    </PeachScrollView>
  </View>
}