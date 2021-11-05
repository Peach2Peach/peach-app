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

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'pgpTest'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('The message')
  const [encryptedMessage, setEncryptedMessage] = useState('')
  const [decryptedMessage, setDecryptedMessage] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [publicKey, setPublicKey] = useState('')

  const getKeys = async () => {
    setIsLoading(true)
    const recipient = await OpenPGP.generate({})
    setPrivateKey(recipient.privateKey)
    setPublicKey(recipient.publicKey)
    setIsLoading(false)
  }

  const encryptMessage = async () => {
    const encrypted = await OpenPGP.encrypt(message, publicKey)

    setEncryptedMessage(encrypted)
  }

  const decryptMessage = async () => {
    const decrypted = await OpenPGP.decrypt(encryptedMessage, privateKey, '')

    setDecryptedMessage(decrypted)
  }

  return <ScrollView>
    <View style={tw`pb-32 flex-col justify-center h-full px-4`}>
      <View style={tw`mt-4`}>
        <Button onPress={getKeys} title={isLoading ? 'Generating...' : '1. Get Keys'}/>
      </View>

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
        ? <Text style={tw`h-32 mt-4 text-xs`}>
          {encryptedMessage}
        </Text>
        : null
      }

      <View style={tw`mt-4`}>
        <Button onPress={decryptMessage} title="4. Decrypt Message"/>
      </View>
      {decryptedMessage
        ? <Text style={tw`h-32 mt-4 text-xs`}>
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