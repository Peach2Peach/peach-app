import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Checkboxes, PremiumSlider, RadioButtons, SatsFormat, Text } from '../../components'
import i18n from '../../utils/i18n'
import BitcoinContext, { getBitcoinContext } from '../../components/bitcoin'
import { CURRENCIES } from '../../constants'
import { PaymentMethods } from '../../components/inputs'
import { SellViewProps } from './Sell'


const validate = (offer: SellOffer) =>
  !!offer.amount
  && offer.currencies.length > 0
  && offer.paymentMethods.length > 0

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid }: SellViewProps): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const { currency } = getBitcoinContext()

  setStepValid(validate(offer))

  return <View style={tw`mb-16`}>
    <Text style={tw`font-baloo uppercase text-center text-peach-1 mt-9`}>
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
      selectedValues={offer.currencies}
      onChange={values => updateOffer({
        ...offer,
        currencies: values as Currency[]
      })}/>


    <Text style={tw`font-baloo uppercase text-center text-peach-1 mt-16`}>
      {i18n('sell.paymentMethods')}
    </Text>
    <PaymentMethods paymentMethods={offer.paymentMethods}
      onChange={(paymentMethods) => updateOffer({
        ...offer,
        paymentMethods
      })}/>

    <Text style={tw`font-baloo uppercase text-center text-peach-1 mt-16 mb-2`}>
      {i18n('sell.price')} {offer.paymentMethods.join()}
    </Text>
    <PremiumSlider min={-10} max={10} value={offer.premium}
      update={`${offer.currencies.join()}${offer.paymentMethods.join()}${offer.kyc}`}
      onChange={value => updateOffer({
        ...offer,
        premium: value as number
      })}
    />
    <View style={tw`text-center mt-4`}>
      <Text style={tw`text-center`}>
        {i18n('form.premium.yousell')} <SatsFormat sats={offer.amount} format="inline" /> {i18n('form.premium.for')}
      </Text>
    </View>
    <View>
      <Text style={tw`text-center`}>
        <Text style={tw`text-peach-1`}> {i18n(`currency.format.${currency}`, String(Math.round(193 * (1 + offer.premium / 100) * 10) / 10))} </Text> ({i18n('form.premium.youget')} <Text style={tw`text-peach-1`}>{offer.premium}%</Text> {i18n(offer.premium >= 0 ? 'form.premium.more' : 'form.premium.less')}) { // eslint-disable-line max-len
        }
      </Text>
    </View>


    <Text style={tw`font-baloo uppercase text-center text-peach-1 mt-16`}>
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
      selectedValue={offer.kyc}
      onChange={value => updateOffer({
        ...offer,
        kyc: value as boolean,
        kycType: offer.kycType || 'iban'
      })}/>
    {offer.kyc
      ? <RadioButtons
        style={tw`px-7 mt-6`}
        items={[
          {
            value: 'iban',
            display: <Text>{i18n('sell.kyc.iban')} ({i18n('default')})</Text>
          },
          {
            value: 'id',
            display: <Text>{i18n('sell.kyc.id')}</Text>
          }
        ]}
        selectedValue={offer.kycType || 'iban'}
        onChange={value => updateOffer({
          ...offer,
          kycType: value as KYCType
        })}/>
      : null
    }
  </View>
}