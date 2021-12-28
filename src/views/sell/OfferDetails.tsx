import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Checkboxes, Dropdown, PremiumSlider, RadioButtons, SatsFormat, Text } from '../../components'
import i18n from '../../utils/i18n'
import BitcoinContext, { getBitcoinContext } from '../../components/bitcoin'
import { CURRENCIES } from '../../constants'

// eslint-disable-next-line max-lines-per-function
export default (): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const [selectedCurrencies, setSelectedCurrencies] = useState([] as (string|number)[])
  const [kyc, setKYC] = useState(false)
  const [kycType, setKYCType] = useState('iban')
  const { currency, satsPerUnit } = getBitcoinContext()
  const [premium, setPremium] = useState(1.5)

  return <View style={tw`mb-16`}>
    <Text style={tw`font-baloo uppercase text-center text-lg text-peach-1 mt-9`}>
      {i18n('sell.currencies')}
    </Text>
    <Checkboxes
      style={tw`px-7 mt-2`}
      items={CURRENCIES.map(value => ({
        value,
        display: <Text>
          {i18n(`currency.${value}`)} <Text style={tw`text-grey-1`}>({value})</Text>
        </Text>
      }))}
      selectedValues={selectedCurrencies}
      onChange={values => setSelectedCurrencies(values)}/>


    <Text style={tw`font-baloo uppercase text-center text-lg text-peach-1 mt-16`}>
      {i18n('sell.paymentMethods')}
    </Text>
    <Text style={tw`text-center mt-16`}>
      {i18n('sell.paymentMethods.empty')}
    </Text>


    <Text style={tw`font-baloo uppercase text-center text-lg text-peach-1 mt-16 mb-2`}>
      {i18n('sell.price')}
    </Text>
    <PremiumSlider min={-10} max={10} value={premium} onChange={value => setPremium(value)}/>
    <View style={tw`text-center mt-4`}>
      <Text style={tw`text-center`}>
        {i18n('form.premium.yousell')} <SatsFormat sats={1000000} format="inline" /> {i18n('form.premium.for')}
      </Text>
    </View>
    <View>
      <Text style={tw`text-center`}>
        <Text style={tw`text-peach-1`}> {i18n(`currency.format.${currency}`, String(Math.round(193 * (1 + premium / 100) * 10) / 10))} </Text> ({i18n('form.premium.youget')} <Text style={tw`text-peach-1`}>{premium}%</Text> {i18n(premium >= 0 ? 'form.premium.more' : 'form.premium.less')}) { // eslint-disable-line max-len
        }
      </Text>
    </View>


    <Text style={tw`font-baloo uppercase text-center text-lg text-peach-1 mt-16`}>
      {i18n('sell.kyc')}
    </Text>
    <RadioButtons
      style={tw`px-7 mt-2`}
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
      onChange={value => setKYC(value as boolean)}/>
    {kyc
      ? <RadioButtons
        style={tw`px-7 mt-6`}
        items={[
          {
            value: 'iban',
            display: <Text>{i18n('sell.kyc.iban')}</Text>
          },
          {
            value: 'id',
            display: <Text>{i18n('sell.kyc.id')}</Text>
          }
        ]}
        selectedValue={kycType}
        onChange={value => setKYCType(value as string)}/>
      : null
    }
  </View>
}