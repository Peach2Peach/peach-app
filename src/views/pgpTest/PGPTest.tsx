import React, { ReactElement, useState, useContext } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import LanguageContext from '../../components/inputs/LanguageSelect'
import OpenPGP from 'react-native-fast-openpgp'
import { Button, Text, Input } from '../../components'
import { account } from '../../utils/account'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'pgpTest'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [message, setMessage] = useState('The message')
  const [encryptedMessage, setEncryptedMessage] = useState('')
  const [decryptedMessage, setDecryptedMessage] = useState('')
  const [signedMessage, setSignedMessage] = useState('')
  const { privateKey, publicKey } = account.pgp

  const encryptMessage = async () => {
    const encrypted = await OpenPGP.encrypt(message, publicKey)
    const signed = await OpenPGP.sign(encrypted, publicKey, privateKey, '')

    setEncryptedMessage(encrypted)
    setSignedMessage(signed)
  }

  const decryptMessage = async () => {
    const decrypted = await OpenPGP.decrypt(encryptedMessage, privateKey, '')

    setDecryptedMessage(decrypted)
  }

  return <ScrollView>
    <View style={tw`pb-32 flex-col justify-center h-full px-4`}>
      {privateKey
        ? <Text style={tw`h-32 mt-4 text-xs`}>
          {privateKey}
        </Text>
        : null
      }

      {publicKey
        ? <Text style={tw`h-32 mt-4 text-xs`}>
          {publicKey}
        </Text>
        : null
      }
      <View style={tw`mt-4`}>
        <Input
          onChange={setMessage}
          value={message}
          label={'2. Message'}
          isValid={true}
          autoCorrect={true}
        />
      </View>

      <View style={tw`mt-4`}>
        <Button onPress={encryptMessage} title="3. Encrypt Message"/>
      </View>

      {encryptedMessage
        ? <Text style={tw`mt-4 text-xs`}>
          {encryptedMessage}
        </Text>
        : null
      }
      {signedMessage
        ? <Text style={tw`mt-4 text-xs`}>
          {signedMessage}
        </Text>
        : null
      }

      <View style={tw`mt-4`}>
        <Button onPress={decryptMessage} title="4. Decrypt Message"/>
      </View>
      {decryptedMessage
        ? <Text style={tw`mt-4 text-xs`}>
          {decryptedMessage}
        </Text>
        : null
      }
      <View style={tw`mt-4`}>
        <Button
          secondary={true}
          onPress={() => navigation.goBack()}
          title="Back"
        />
      </View>
    </View>
  </ScrollView>
}