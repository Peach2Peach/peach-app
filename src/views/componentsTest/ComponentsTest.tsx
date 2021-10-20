import React, { ReactElement, useContext } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, BitcoinAddress } from '../../components'
import QRCode from 'react-native-qrcode-svg'
import peachLogo from '../../../assets/favico/peach-icon-192.png'

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
    <View style={tw`flex-col items-center`}>
      <QRCode
        size={241}
        value="1BitcoinEaterAddressDontSendf59kuE"
        logo={peachLogo}
      />
      <BitcoinAddress style={tw`mt-4`} address="1BitcoinEaterAddressDontSendf59kuE" />
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