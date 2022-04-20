
import React, { ReactElement, useContext, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Headline, Shadow, Text, HorizontalLine } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { mildShadow, mildShadowOrange, mildShadowRed } from '../../utils/layout'
import LanguageContext from '../../contexts/language'
import { Selector } from '../inputs'
import { thousands } from '../../utils/string'
import Medal from '../medal'
import { unique } from '../../utils/array'
import { SATSINBTC } from '../../constants'
import Icon from '../Icon'
import { ExtraMedals } from './components/ExtraMedals'

type MatchProps = ComponentProps & {
  match: Match,
  offer: BuyOffer|SellOffer,
  toggleMatch: (match: Match) => void,
  onChange: (i?: number|null, currency?: Currency|null, paymentMethod?: PaymentMethod|null) => void,
}

/**
 * @description Component to display a match
 * @param match the match
 * @example
 * <Match match={match} />
 */
// eslint-disable-next-line max-lines-per-function
export const Match = ({ match, offer, toggleMatch, onChange, style }: MatchProps): ReactElement => {
  useContext(LanguageContext)

  const [selectedCurrency, setSelectedCurrency] = useState(
    match.selectedCurrency
    || Object.keys(match.prices)[0] as Currency
  )
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    match.selectedPaymentMethod
    || match.paymentMethods[0]
  )
  const price = match.prices[selectedCurrency] / (offer.amount / SATSINBTC)

  const setCurrency = (currency: Currency) => {
    match.selectedCurrency = selectedCurrency
    setSelectedCurrency(currency)
    onChange(null, currency, selectedPaymentMethod)
  }
  const setPaymentMethod = (paymentMethod: PaymentMethod) => {
    match.selectedPaymentMethod = selectedPaymentMethod
    setSelectedPaymentMethod(paymentMethod)
    onChange(null, selectedCurrency, paymentMethod)
  }
  return <Shadow {...(match.matched ? mildShadowOrange : mildShadow)} viewStyle={[
    tw`w-full border border-grey-4 rounded-md bg-white-1`,
    match.matched ? tw`border-peach-1` : {},
    style
  ]}>
    {match.matched
      ? <View style={tw`absolute top-0 left-0 w-full h-full z-20`}>
        <Pressable onPress={() => toggleMatch(match)} style={tw`absolute top-0 right-0 p-2 z-10`}>
          <Shadow {...mildShadowRed}>
            <View style={tw`bg-white-1 rounded-full p-0.5`}>
              <Icon id="undo" style={tw`w-4 h-4`}/>
            </View>
          </Shadow>
        </Pressable>
        <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
        <Text style={tw`absolute bottom-full w-full text-center font-baloo text-peach-1 text-xs`}>
          {i18n('search.matched')}
        </Text>
      </View>
      : null
    }
    <View style={tw`px-5 pt-6 pb-9`}>
      <View style={tw`w-full flex-row justify-between`}>
        <View style={tw`px-6`}>
          <Text style={tw`text-lg`}>
            {match.user.id.substring(0, 8)}
          </Text>
          <ExtraMedals user={match.user} style={tw`mt-2`} />
        </View>
        <View style={tw`px-6`}>
          <Medal id={match.user.rating > 0.9 ? 'gold' : 'silver'} />
        </View>
      </View>
      <HorizontalLine style={tw`mt-4`}/>
      <View style={tw`flex-row justify-center mt-3`}>
        <Text style={tw`font-baloo text-xl leading-xl text-peach-1`}>
          {i18n(`currency.format.${selectedCurrency}`, String(match.prices[selectedCurrency]))}
        </Text>
        <Text style={tw`text-lg leading-lg ml-2`}>
          {i18n('pricePerBitcoin', i18n(`currency.format.${selectedCurrency}`, thousands(Math.round(price))))}
        </Text>
      </View>
      <HorizontalLine style={tw`mt-3`}/>
      <Headline style={tw`mt-4 lowercase text-grey-1`}>
        {i18n('form.currency')}:
      </Headline>
      <Selector
        style={tw`mt-4`}
        selectedValue={selectedCurrency}
        items={Object.keys(match.prices).map(c => ({ value: c, display: c }))}
        onChange={c => setCurrency(c as Currency)}
      />
      <HorizontalLine style={tw`mt-5`}/>
      <Headline style={tw`mt-4 lowercase text-grey-1`}>
        {i18n('form.paymentMethod')}:
      </Headline>
      <Selector
        style={tw`mt-4`}
        selectedValue={selectedPaymentMethod as string}
        items={match.paymentMethods.filter(unique()).map(p => ({
          value: p,
          display: i18n(`paymentMethod.${p}`)
        }))}
        onChange={c => setPaymentMethod(c as PaymentMethod)}
      />
      {/* <HorizontalLine style={tw`mt-5`}/>
      {!match.kyc
        ? <Headline style={tw`text-lg text-left`}>{i18n('kycFree')}</Headline>
        : null
      } */}
    </View>
  </Shadow>
}

export default Match