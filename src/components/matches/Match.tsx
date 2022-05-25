
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Headline, Shadow, Text, HorizontalLine } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { mildShadow, mildShadowOrange, dropShadowRed, noShadow } from '../../utils/layout'
import LanguageContext from '../../contexts/language'
import { Selector } from '../inputs'
import { padString } from '../../utils/string'
import { Rating, ExtraMedals } from '../user'
import { unique } from '../../utils/array'
import Icon from '../Icon'
import { interpolate } from '../../utils/math'
import { StackNavigationProp } from '@react-navigation/stack'
import { getCurrencies, getPaymentMethods, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'search'>

type MatchProps = ComponentProps & {
  match: Match,
  offer: BuyOffer|SellOffer,
  toggleMatch: (match: Match) => void,
  onChange: (i?: number|null, currency?: Currency|null, paymentMethod?: PaymentMethod|null) => void,
  navigation: ProfileScreenNavigationProp,
  renderShadow?: boolean
}

/**
 * @description Component to display a match
 * @param match the match
 * @example
 * <Match match={match} />
 */
// eslint-disable-next-line max-lines-per-function
export const Match = ({
  match,
  offer,
  toggleMatch,
  onChange,
  navigation,
  renderShadow,
  style
}: MatchProps): ReactElement => {
  useContext(LanguageContext)

  const [selectedCurrency, setSelectedCurrency] = useState(
    match.selectedCurrency || Object.keys(match.meansOfPayment)[0] as Currency
  )
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    match.selectedPaymentMethod || getPaymentMethods(match.meansOfPayment)[0]
  )
  const currencies = getCurrencies(match.meansOfPayment)
  const [applicablePaymentMethods, setApplicablePaymentMethods] = useState(
    getPaymentMethods(match.meansOfPayment).filter(p => paymentMethodAllowedForCurrency(p, selectedCurrency))
  )

  const shadow = renderShadow
    ? match.matched
      ? mildShadowOrange
      : mildShadow
    : noShadow

  const userRating = Math.round(interpolate(match.user.rating, [-1, 1], [0, 5]) * 10) / 10
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
    setApplicablePaymentMethods(getPaymentMethods(match.meansOfPayment)
      .filter(p => paymentMethodAllowedForCurrency(p, currency))
    )
    if (!paymentMethodAllowedForCurrency(selectedPaymentMethod, currency)) {
      setSelectedPaymentMethod((match.meansOfPayment[currency] || [])[0])
    }
  }
  const setPaymentMethod = (paymentMethod: PaymentMethod) => {
    match.selectedPaymentMethod = selectedPaymentMethod
    setSelectedPaymentMethod(paymentMethod)
  }

  return <Shadow shadow={shadow}>
    <View style={[
      tw`w-full border border-grey-4 bg-white-1 rounded-md`,
      match.matched ? tw`border-peach-1` : {},
      style
    ]}>
      {match.matched
        ? <View style={tw`absolute top-0 left-0 w-full h-full z-20`}>
          <Pressable onPress={() => toggleMatch(match)} style={tw`absolute top-0 right-0 p-2 z-10`}>
            <Shadow shadow={dropShadowRed} style={tw`rounded-full`}>
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
        <Pressable onPress={() => navigation.navigate('profile', { userId: match.user.id, user: match.user })}
          style={tw`w-full flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-base`}>
              <Text style={tw`font-bold text-base`}>
                {i18n(offer.type === 'ask' ? 'buyer' : 'seller')}:
              </Text>
              <Text style={tw`text-base`}> Peach{match.user.id.substring(0, 8)}</Text>
            </Text>
            <View style={tw`flex-row items-center`}>
              <Rating rating={match.user.rating} style={tw`h-4`}/>
              <Text style={tw`font-bold font-baloo text-sm leading-4 ml-1 mt-2 text-grey-2`}>{userRating} / 5</Text>
            </View>
          </View>
          <ExtraMedals user={match.user} />
        </Pressable>
        <HorizontalLine style={[tw`mt-3`, tw.md`mt-4`]}/>
        <View style={[tw`mt-3`, tw.md`mt-4`]}>
          <Text style={tw`font-baloo text-xl leading-xl text-peach-1 text-center`}>
            {i18n(
              `currency.format.${selectedCurrency}`,
              displayPrice
            )}
          </Text>
          <Text style={tw`text-lg leading-lg text-center text-grey-2 ml-2`}>
            ({i18n(
              match.premium > 0 ? 'offer.summary.premium' : 'offer.summary.discount',
              String(Math.abs(match.premium))
            )})
          </Text>
        </View>
        <HorizontalLine style={[tw`mt-4`, tw.md`mt-5`]}/>
        <Headline style={[tw`mt-3 lowercase text-grey-2`, tw.md`mt-4`]}>
          {i18n(offer.type === 'bid' ? 'form.currency' : 'match.selectedCurrency')}:
        </Headline>
        <Selector
          style={tw`mt-2`}
          selectedValue={selectedCurrency}
          items={currencies.map(c => ({ value: c, display: c }))}
          onChange={c => setCurrency(c as Currency)}
        />
        <HorizontalLine style={[tw`mt-4`, tw.md`mt-5`]}/>
        <Headline style={[tw`mt-3 lowercase text-grey-2`, tw.md`mt-4`]}>
          {i18n(offer.type === 'bid' ? 'form.paymentMethod' : 'match.selectedPaymentMethod')}:
        </Headline>
        <Selector
          style={tw`mt-2`}
          selectedValue={selectedPaymentMethod as string}
          items={applicablePaymentMethods.map(p => ({
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
    </View>
  </Shadow>
}

export default Match