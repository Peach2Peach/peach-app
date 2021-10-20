import React, { ReactElement, useContext } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, BitcoinAddress } from '../../components'

type RootStackParamList = {
  Home: undefined,
  AccountTest: undefined,
  InputTest: undefined,
  ComponentsTest: undefined
}

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AccountTest'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  return <View style={tw`flex-col justify-center h-full px-4`}>
    <BitcoinAddress
      style={tw`mt-4`}
      address="1BitcoinEaterAddressDontSendf59kuE"
      showQR={true}
    />
    <View style={tw`mt-4`}>
      <Button
        secondary={true}
        onPress={() => navigation.goBack()}
        title="Back"
      />
    </View>
  </View>
}