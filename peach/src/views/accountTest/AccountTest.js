import React, { useState } from 'react'
import {
  Button,
  TextInput,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { backupAccount, createAccount, getAccount, recoverAccount } from '../../utils/accountUtils'

export default ({ navigation }) => {
  let [password] = useState(true)
  return <View style={tw`flex-col justify-center h-full`}>
    <View style={tw`mt-4`}>
      <TextInput
        placeholder="Password"
        onChangeText={value => password = value}
        secureTextEntry={true}
      />
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => createAccount('', password)} title="Create account"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => getAccount(password)} title="Get account"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={backupAccount} title="Backup account"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => recoverAccount(password)} title="Recover account"/>
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={() => navigation.goBack()} title="Back"/>
    </View>
  </View>
}