import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Checkboxes, Headline, PremiumSlider, RadioButtons, SatsFormat, Text } from '../../components'
import i18n from '../../utils/i18n'
import BitcoinContext, { getBitcoinContext } from '../../components/bitcoin'
import { CURRENCIES } from '../../constants'
import { PaymentMethods } from '../../components/inputs'
import { SellViewProps } from './Sell'
import { account, updateSettings } from '../../utils/accountUtils'


const validate = (offer: SellOffer) =>
  !!offer.amount
  && offer.currencies.length > 0
  && offer.paymentData.length > 0

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const { currency } = getBitcoinContext()
  const [currencies, setCurrencies] = useState(account.settings.currencies || offer.currencies)
  const [premium, setPremium] = useState(account.settings.premium || offer.premium)
  const [paymentData, setPaymentData] = useState(account.paymentData || [])
  const [kyc, setKYC] = useState(account.settings.kyc || offer.kyc)
  const [kycType, setKYCType] = useState(account.settings.kycType || offer.kycType)

  useEffect(() => {
    updateOffer({
      ...offer,
      currencies,
      paymentData: paymentData.filter(data => data.selected),
      kyc,
      kycType,
    })
    updateSettings({
      currencies,
      premium,
      kyc,
      kycType,
    })

    setStepValid(validate(offer))
  }, [currencies, paymentData, premium, kyc, kycType])

  return <View style={tw`mb-16`}>
    <Headline style={tw`mt-9`}>
      {i18n('sell.currencies')}
    </Headline>
    <Checkboxes
      style={tw`px-7 mt-2`}
      items={CURRENCIES.map(value => ({
        value,
        display: <Text>
          {i18n(`currency.${value}`)} <Text style={tw`text-grey-1`}>({value})</Text>
        </Text>
      }))}
      selectedValues={currencies}
      onChange={values => setCurrencies(values as Currency[])}/>
    <Headline style={tw`mt-16`}>
      {i18n('sell.paymentMethods')}
    </Headline>
    <PaymentMethods paymentData={account.paymentData}
      onChange={updatedPaymentData => setPaymentData(updatedPaymentData)}/>

    <Headline style={tw`mt-16 mb-2`}>
      {i18n('sell.price')}
    </Headline>
    <PremiumSlider min={-10} max={10} value={premium}
      update={`${currencies.join()}${paymentData.join()}${kyc}`}
      onChange={value => setPremium(value)}/>
    <View style={tw`text-center mt-4`}>
      <Text style={tw`text-center`}>
        {i18n('form.premium.yousell')} <SatsFormat sats={offer.amount} format="inline" /> {i18n('form.premium.for')}
      </Text>
    </View>
    <View>
      <Text style={tw`text-center`}>
        <Text style={tw`text-peach-1`}> {i18n(`currency.format.${currency}`, String(Math.round(193 * (1 + premium / 100) * 10) / 10))} </Text> ({i18n('form.premium.youget')} <Text style={tw`text-peach-1`}>{premium}%</Text> {i18n(premium >= 0 ? 'form.premium.more' : 'form.premium.less')}) { // eslint-disable-line max-len
        }
      </Text>
    </View>

    <Headline style={tw`mt-16`}>
      {i18n('sell.kyc')}
    </Headline>
    <RadioButtons
      style={tw`px-7 mt-2`}
      items={[
        { value: true, display: <Text>{i18n('yes')}</Text> },
        { value: false, display: <Text>{i18n('no')}</Text> }
      ]}
      selectedValue={kyc}
      onChange={value => setKYC(value as boolean)}/>
    {kyc
      ? <RadioButtons
        style={tw`px-7 mt-6`}
        items={[
          { value: 'iban', display: <Text>{i18n('sell.kyc.iban')} ({i18n('default')})</Text> },
          { value: 'id', display: <Text>{i18n('sell.kyc.id')}</Text> }
        ]}
        selectedValue={kycType || 'iban'}
        onChange={value => setKYCType(value as KYCType)}/>
      : null
    }
  </View>
}