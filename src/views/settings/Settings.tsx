import React, { ReactElement, useContext } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Button, PeachScrollView, Text, Title } from '../../components'
import { account, backupAccount, deleteAccount } from '../../utils/account'
import { API_URL, NETWORK } from '@env'

import { version } from '../../../package.json'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'settings'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  return <View style={tw`h-full pb-32`}>
    <PeachScrollView contentContainerStyle={tw`px-6`}>
      <Title title={'Settings'} />
      <Text style={tw`text-sm text-grey-2`}>
        App version: {version}
      </Text>
      <Text style={tw`text-sm text-grey-2`}>
        API URL: {API_URL}
      </Text>
      <Text style={tw`text-sm text-grey-2`}>
        Network: {NETWORK}
      </Text>
      <Text style={tw`text-sm text-grey-2`}>
        Your public key: {account.publicKey}
      </Text>
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
                navigation.navigate('welcome')
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
      <View style={tw`mt-4`}>
        <Button
          secondary={true}
          // eslint-disable-next-line no-console
          onPress={() => console.log(JSON.stringify(account))}
          title="Data Dump"
        />
      </View>
    </PeachScrollView>
  </View>
}