
import React, { ReactElement, useContext, useState } from 'react'
import { Image, Pressable, View } from 'react-native'
import { Headline, Shadow, Text, HorizontalLine } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { mildShadow, mildShadowOrange, mildShadowRed } from '../../utils/layout'
import LanguageContext from '../../contexts/language'
import { Selector } from '../inputs'
import { padString, thousands } from '../../utils/string'
import Medal from '../medal'
import { unique } from '../../utils/array'
import Icon from '../Icon'
import { ExtraMedals } from './components/ExtraMedals'
import { GOLDMEDAL, SATSINBTC, SILVERMEDAL } from '../../constants'

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
    match.selectedCurrency || Object.keys(match.prices)[0] as Currency
  )
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    match.selectedPaymentMethod || match.paymentMethods[0]
  )

  const medal = match.user.rating > GOLDMEDAL
    ? 'gold'
    : match.user.rating > SILVERMEDAL
      ? 'silver'
      : null

  const matchPrice = match.matched && match.matchedPrice ? match.matchedPrice : match.prices[selectedCurrency] as number
  const price = (matchPrice) / (offer.amount / SATSINBTC)
  let displayPrice = String(match.matched && match.matchedPrice ? match.matchedPrice : match.prices[selectedCurrency])
  displayPrice = `${(displayPrice).split('.')[0]}.${padString({
    string: (displayPrice).split('.')[1],
    length: 2,
    char: '0',
    side: 'right'
  })}`
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
              <Icon id="undo" style={tw`w-4 h-4`} color={tw`text-grey-2`.color as string}/>
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
    <View style={tw`px-5 pt-5 pb-8`}>
      <View style={tw`w-full flex-row justify-between items-center`}>
        <View style={tw`px-6`}>
          <Text style={tw`text-lg`}>
            <Image source={require('../../../assets/favico/peach-logo.png')}
              style={[tw`w-4 h-4 mr-1`, { resizeMode: 'contain' }]}
            />
            {match.user.id.substring(0, 8)}
          </Text>
          <ExtraMedals user={match.user} />
        </View>
        {medal
          ? <View style={tw`px-6`}>
            <Medal id={medal} style={tw`w-16 h-12`}/>
          </View>
          : null
        }
      </View>
      <HorizontalLine style={tw`mt-4`}/>
      <View style={tw`mt-4`}>
        <Text style={tw`font-baloo text-xl leading-xl text-peach-1 text-center`}>
          {i18n(
            `currency.format.${selectedCurrency}`,
            displayPrice
          )}
        </Text>
        <Text style={tw`text-lg leading-lg text-center ml-2`}>
          {i18n(
            'pricePerBitcoin',
            i18n(`currency.format.${selectedCurrency}`, thousands(Math.round(price)))
          )}
        </Text>
      </View>
      <HorizontalLine style={tw`mt-5`}/>
      <Headline style={tw`mt-4 lowercase text-grey-1`}>
        {i18n(offer.type === 'bid' ? 'form.currency' : 'match.selectedCurrency')}:
      </Headline>
      <Selector
        style={tw`mt-2`}
        selectedValue={selectedCurrency}
        items={Object.keys(match.prices).map(c => ({ value: c, display: c }))}
        onChange={c => setCurrency(c as Currency)}
      />
      <HorizontalLine style={tw`mt-5`}/>
      <Headline style={tw`mt-4 lowercase text-grey-1`}>
        {i18n(offer.type === 'bid' ? 'form.paymentMethod' : 'match.selectedPaymentMethod')}:
      </Headline>
      <Selector
        style={tw`mt-2`}
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