import React, { ReactElement, useContext } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, PeachScrollView, Text } from '../../components'
import { account, backupAccount, deleteAccount } from '../../utils/account'
import { API_URL, DEV, NETWORK } from '@env'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'settings'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  return <PeachScrollView>
    <View style={tw`pb-32 h-full`}>
      <View style={tw`flex-col justify-center h-full`}>
        <Text style={tw`font-lato-bold text-center text-5xl leading-5xl text-gray-700`}>
          Settings
        </Text>
      </View>
      <Text style={tw`text-sm text-grey-2`}>
        API URL: {API_URL}
      </Text>
      <Text style={tw`text-sm text-grey-2`}>
        Network: {NETWORK}
      </Text>
      <Text style={tw`text-sm text-grey-2`}>
        Env: {DEV ? 'staging' : null}
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
    </View>
  </PeachScrollView>
}