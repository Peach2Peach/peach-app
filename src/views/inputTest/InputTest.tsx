import React, { ReactElement, useState, useContext } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import Input from '../../components/inputs/Input'
import { getMessages, rules } from '../../utils/validationUtils'
import i18n from '../../utils/i18n'
import LanguageContext from '../../components/inputs/LanguageSelect'
import Button from '../../components/Button'

// import { fromBase58Check, fromBech32 } from 'bitcoinjs-lib/types/address'
const { useValidation } = require('react-native-form-validator')

type RootStackParamList = {
  Home: undefined,
  AccountTest: undefined,
  InputTest: undefined
}

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AccountTest'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [prestine, setPristine] = useState(true)
  const [address, setAddress] = useState('')
  const [iban, setIBAN] = useState('')

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { address, iban },
    rules,
    messages: getMessages()
  })

  const onSubmit = () => {
    if (prestine) setPristine(false)
    validate({
      address: {
        required: true,
        bitcoinAddress: true
      },
      iban: {
        iban: true
      }
    })
  }

  return <View style={tw`flex-col justify-center h-full px-4`}>
    <View style={tw`w-6/12 mt-4`}>
      <Input
        onChange={setAddress}
        value={'smol input'}
      />
    </View>
    <View style={tw`mt-4`}>
      <Input
        onChange={setAddress}
        value={address}
        label={i18n('form.btcAddress')}
        isValid={!isFieldInError('address')}
        autoCorrect={false}
        errorMessage={getErrorsInField('address')}
      />
    </View>
    <View style={tw`mt-4`}>
      <Input
        onChange={setIBAN}
        value={iban}
        label={i18n('form.iban')}
        isValid={!isFieldInError('iban')}
        autoCorrect={false}
        errorMessage={getErrorsInField('iban')}
      />
    </View>
    <View style={tw`mt-4`}>
      <Button onPress={onSubmit} title="Validate"/>
    </View>
    <View style={tw`mt-4`}>
      <Button
        secondary={true}
        onPress={() => navigation.goBack()}
        title="Back"
      />
    </View>
  </View>
}