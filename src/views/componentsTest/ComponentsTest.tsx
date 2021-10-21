import React, { ReactElement, useContext, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, BitcoinAddress, Text, Dropdown } from '../../components'

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

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  const [selectedValue, setSelectedValue] = useState(500000)
  useContext(LanguageContext)

  return <ScrollView>
    <View style={tw`flex-col justify-center h-full px-4`}>
      <Text style={tw`font-baloo text-xl text-center`}>
        QR Code
      </Text>
      <BitcoinAddress
        style={tw`mt-4`}
        address="1BitcoinEaterAddressDontSendf59kuE"
        showQR={true}
      />
      <Text style={tw`font-baloo text-xl text-center mt-8`}>
        Amount Select
      </Text>
      <View style={tw`flex items-center`}>
        <Dropdown
          selectedValue={selectedValue}
          onChange={(value) => setSelectedValue(value as number)}
          width={tw`w-72`.width as number}
          items={[
            {
              value: 500000,
              display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row justify-start items-center`}>
                  <Text style={tw`font-mono text-grey-2`}>0.00</Text><Text style={tw`font-mono`}> 500 000 Sat</Text>
                </View>
                {isOpen
                  ? <Text style={tw`font-mono text-peach-1`}>€50</Text>
                  : null
                }
              </View>
            },
            {
              value: 1000000,
              display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row justify-start items-center`}>
                  <Text style={tw`font-mono text-grey-2`}>0.01</Text><Text style={tw`font-mono`}> 000 000 Sat</Text>
                </View>
                {isOpen
                  ? <Text style={tw`font-mono text-peach-1`}>€100</Text>
                  : null
                }
              </View>
            },
            {
              value: 2000000,
              display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row justify-start items-center`}>
                  <Text style={tw`font-mono text-grey-2`}>0.02</Text><Text style={tw`font-mono`}> 000 000 Sat</Text>
                </View>
                {isOpen
                  ? <Text style={tw`font-mono text-peach-1`}>€200</Text>
                  : null
                }
              </View>
            }
          ]}
        />
      </View>
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