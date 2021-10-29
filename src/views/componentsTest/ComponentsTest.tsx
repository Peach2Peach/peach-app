import React, { ReactElement, useContext, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, BitcoinAddress, Text, Dropdown, SatsFormat, Checkboxes, RadioButtons } from '../../components'
import BitcoinContext, { getBitcoinContext } from '../../components/bitcoin'
import i18n from '../../utils/i18n'

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

const currencies = [
  'EUR',
  'CHF',
  'GBP',
  'SEK'
]
const buckets = [
  250000,
  500000,
  1000000,
  2000000,
  5000000
]

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  const [selectedCurrencies, setSelectedCurrencies] = useState([] as (string|number)[])
  const [kyc, setKYC] = useState(false)
  const [selectedValue, setSelectedValue] = useState(buckets[0])

  useContext(LanguageContext)
  useContext(BitcoinContext)
  const { currency, satsPerUnit } = getBitcoinContext()

  return <ScrollView>
    <View style={tw`flex-col justify-center h-full px-4`}>
      <Text style={tw`font-baloo text-xl text-center`}>
        Checkbox
      </Text>
      <Checkboxes
        items={currencies.map(value => ({
          value,
          display: [
            <Text>{i18n(`currency.${value}`)} </Text>,
            <Text style={tw`text-grey-1`}>({value})</Text>
          ]
        }))}
        selectedValues={selectedCurrencies}
        onChange={(values) => setSelectedCurrencies(values)}/>
      <Text style={tw`font-baloo text-xl text-center mt-8`}>
        Radiobutton
      </Text>
      <RadioButtons
        items={[
          {
            value: true,
            display: <Text>{i18n('yes')}</Text>
          },
          {
            value: false,
            display: <Text>{i18n('no')}</Text>
          }
        ]}
        selectedValue={kyc}
        onChange={(value) => setKYC(value as boolean)}/>
      <Text style={tw`font-baloo text-xl text-center mt-8`}>
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
      {buckets.map(value => <SatsFormat sats={value}/>)}
      <Text style={tw`font-baloo text-xl text-center mt-8`}>
        Amount Select
      </Text>
      <View style={tw`flex items-center`}>
        <Dropdown
          selectedValue={selectedValue}
          onChange={(value) => setSelectedValue(value as number)}
          width={tw`w-80`.width as number}
          items={buckets.map(value => ({
            value,
            display: (isOpen: boolean) => <View style={tw`flex-row justify-between items-center`}>
              <SatsFormat sats={value}/>
              {isOpen
                ? <Text style={tw`font-mono text-peach-1`}>
                  {i18n(`currency.format.${currency}`, String(Math.round(value / satsPerUnit)))}
                </Text>
                : null
              }
            </View>
          })
          )}
        />
      </View>
      <Text style={tw`mt-4 font-mono text-peach-1 text-center`}>
        {i18n(`currency.format.${currency}`, String(Math.round(selectedValue / satsPerUnit)))}
      </Text>
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