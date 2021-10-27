import React, { ReactElement, useContext, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, BitcoinAddress, Text, Dropdown, SatsFormat } from '../../components'
import { getBitcoinContext } from '../../components/bitcoin'

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

const buckets = [
  250000,
  500000,
  1000000,
  2000000,
  5000000
]

export default ({ navigation }: Props): ReactElement => {
  const [selectedValue, setSelectedValue] = useState(buckets[0])
  useContext(LanguageContext)
  const { satsPerUnit } = getBitcoinContext()

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
        Sats Format
      </Text>
      {buckets.map(value =><SatsFormat sats={value}/>)}
      <Text style={tw`font-baloo text-xl text-center mt-8`}>
        Amount Select
      </Text>
      <View style={tw`flex items-center`}>
        <Dropdown
          selectedValue={selectedValue}
          onChange={(value) => setSelectedValue(value as number)}
          width={tw`w-72`.width as number}
          items={buckets.map(value => ({
            value,
            display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
              <SatsFormat sats={value}/>
              {isOpen
                ? <Text style={tw`font-mono text-peach-1`}>€{Math.round(value / satsPerUnit)}</Text>
                : null
              }
            </View>
          })
          )}
        />
      </View>
      <Text style={tw`mt-4 font-mono text-peach-1 text-center`}>€{Math.round(selectedValue / satsPerUnit)}</Text>
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