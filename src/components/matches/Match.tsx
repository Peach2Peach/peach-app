import React, { ReactElement, useContext, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Headline, HorizontalLine, Shadow, Text } from '..'

import LanguageContext from '../../contexts/language'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { dropShadowRed, mildShadow, mildShadowOrange, noShadow } from '../../utils/layout'
import { interpolate } from '../../utils/math'
import { Navigation } from '../../utils/navigation'
import {
  getCurrencies,
  getMoPsInCommon,
  getPaymentMethodInfo,
  getPaymentMethods,
  hasMoPsInCommon,
  paymentMethodAllowedForCurrency,
} from '../../utils/paymentMethod'
import { padString } from '../../utils/string'
import Icon from '../Icon'
import { Selector } from '../inputs'
import { ExtraMedals, Rating } from '../user'

type MatchProps = ComponentProps & {
  match: Match
  offer: BuyOffer | SellOffer
  toggleMatch: (match: Match) => void
  onChange: (i?: number | null, currency?: Currency | null, paymentMethod?: PaymentMethod | null) => void
  navigation: Navigation
  renderShadow?: boolean
}

/**
 * @description Component to display a match
 * @param match the match
 * @example
 * <Match match={match} />
 */
export const Match = ({
  match,
  offer,
  toggleMatch,
  onChange,
  navigation,
  renderShadow,
  style,
}: MatchProps): ReactElement => {
  useContext(LanguageContext)

  // 1. check which means of payment match has in common, if non in common, use match MoPs
  const [mopsInCommon] = useState(() =>
    hasMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
      ? getMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
      : match.meansOfPayment,
  )
  const [paymentMethodsInCommon] = useState(() => getPaymentMethods(mopsInCommon))
  const [allPaymentMethods] = useState(() => getPaymentMethods(match.meansOfPayment))

  // 2. if match has mops in common, display only double pairs, if not, display single pairs
  const [currencies] = useState(() => getCurrencies(paymentMethodsInCommon.length ? mopsInCommon : match.meansOfPayment))
  const [selectedCurrency, setSelectedCurrency] = useState(() =>
    match.selectedCurrency && currencies.indexOf(match.selectedCurrency) !== -1 ? match.selectedCurrency : currencies[0],
  )

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    match.selectedPaymentMethod || mopsInCommon[selectedCurrency]![0],
  )
  const paymentInfo = getPaymentMethodInfo(selectedPaymentMethod)

  const [applicablePaymentMethods, setApplicablePaymentMethods] = useState(() =>
    (paymentMethodsInCommon.length ? paymentMethodsInCommon : allPaymentMethods)
      .filter((p) => paymentMethodAllowedForCurrency(p, selectedCurrency))
      .filter((p) => mopsInCommon[selectedCurrency]?.indexOf(p) !== -1),
  )
  const currencySelectorItems = currencies.map((c) => ({ value: c, display: c }))
  const paymentMethodSelectorItems = applicablePaymentMethods.map((p) => ({
    value: p,
    display: i18n(`paymentMethod.${p}`),
  }))

  const shadow = renderShadow ? (match.matched ? mildShadowOrange : mildShadow) : noShadow

  // if user is ambassador and has no ratings, give 3/5 peaches by default
  const rawRating
    = match.user.ratingCount === 0 && match.user.medals.indexOf('ambassador') !== -1 ? 0.2 : match.user.rating
  const userRating = Math.round(interpolate(rawRating, [-1, 1], [0, 5]) * 10) / 10
  let displayPrice = String(
    match.matched && match.matchedPrice
      ? match.matchedPrice
      : paymentInfo?.rounded
        ? Math.round(match.prices[selectedCurrency]!)
        : match.prices[selectedCurrency],
  )
  displayPrice = `${displayPrice.split('.')[0]}.${padString({
    string: displayPrice.split('.')[1],
    length: 2,
    char: '0',
    side: 'right',
  })}`
  const setCurrency = (currency: Currency) => {
    let selectedMethod = selectedPaymentMethod
    match.selectedCurrency = selectedCurrency
    setSelectedCurrency(currency)
    setApplicablePaymentMethods(
      (paymentMethodsInCommon.length ? paymentMethodsInCommon : allPaymentMethods)
        .filter((p) => paymentMethodAllowedForCurrency(p, selectedCurrency))
        .filter((p) => mopsInCommon[currency]?.indexOf(p) !== -1),
    )
    if (mopsInCommon[currency]?.indexOf(selectedPaymentMethod) === -1) {
      selectedMethod = (mopsInCommon[currency] || [])[0]
      setSelectedPaymentMethod(selectedMethod)
      match.selectedPaymentMethod = selectedMethod
    }
    onChange(null, currency, selectedMethod)
  }
  const setPaymentMethod = (paymentMethod: PaymentMethod) => {
    match.selectedPaymentMethod = paymentMethod
    setSelectedPaymentMethod(paymentMethod)
    onChange(null, selectedCurrency, paymentMethod)
  }
  const undoMatch = () => toggleMatch(match)

  return (
    <Shadow shadow={shadow}>
      <View
        style={[
          tw`w-full border border-grey-4 bg-white-1 rounded-md my-5`,
          match.matched ? tw`border-peach-1` : {},
          style,
        ]}
      >
        {match.matched ? (
          <View style={tw`absolute top-0 left-0 w-full h-full z-20`}>
            <Pressable onPress={undoMatch} style={tw`absolute top-0 right-0 p-2 z-10`}>
              <Shadow shadow={dropShadowRed} style={tw`rounded-full`}>
                <View style={tw`bg-white-1 rounded-full p-0.5`}>
                  <Icon id="undo" style={tw`w-4 h-4`} color={tw`text-grey-2`.color} />
                </View>
              </Shadow>
            </Pressable>
            <View style={tw`w-full h-full bg-peach-translucent opacity-30`} />
            <Text style={tw`absolute bottom-full w-full text-center font-baloo text-peach-1 text-xs`}>
              {i18n('search.matched')}
            </Text>
          </View>
        ) : null}
        <View style={tw`px-5 pt-5 pb-8`}>
          <Pressable
            onPress={() => navigation.navigate('profile', { userId: match.user.id, user: match.user })}
            style={tw`w-full flex-row justify-between items-center`}
          >
            <View>
              <Text style={tw`text-base`}>
                <Text style={tw`font-bold text-base`}>{i18n(offer.type === 'ask' ? 'buyer' : 'seller')}:</Text>
                <Text style={tw`text-base`}> Peach{match.user.id.substring(0, 8)}</Text>
              </Text>
              {match.user.trades < 3 ? (
                <Text style={tw`font-bold font-baloo text-sm leading-4 ml-1 mt-2 text-grey-2`}>
                  {i18n('rating.newUser')}
                </Text>
              ) : (
                <View style={tw`flex-row items-center`}>
                  <Rating rating={rawRating} style={tw`h-4`} />
                  <Text style={tw`font-bold font-baloo text-sm leading-4 ml-1 mt-2 text-grey-2`}>{userRating} / 5</Text>
                </View>
              )}
            </View>
            <ExtraMedals user={match.user} />
          </Pressable>
          <HorizontalLine style={[tw`mt-3`, tw.md`mt-4`]} />
          <View style={[tw`mt-3`, tw.md`mt-4`]}>
            <Text style={tw`font-baloo text-xl leading-xl text-peach-1 text-center`}>
              {i18n(`currency.format.${selectedCurrency}`, displayPrice)}
            </Text>
            <Text style={tw`text-lg leading-lg text-center text-grey-2 ml-2`}>
              (
              {i18n(
                match.premium > 0 ? 'offer.summary.premium' : 'offer.summary.discount',
                String(Math.abs(match.premium)),
              )}
              )
            </Text>
          </View>
          <HorizontalLine style={[tw`mt-4`, tw.md`mt-5`]} />
          <Headline style={[tw`mt-3 lowercase text-grey-2`, tw.md`mt-4`]}>
            {i18n(offer.type === 'bid' ? 'form.currency' : 'match.selectedCurrency')}:
          </Headline>
          <Selector
            style={tw`mt-2`}
            selectedValue={selectedCurrency}
            items={currencySelectorItems}
            onChange={setCurrency}
          />
          <HorizontalLine style={[tw`mt-4`, tw.md`mt-5`]} />
          <Headline style={[tw`mt-3 lowercase text-grey-2`, tw.md`mt-4`]}>
            {i18n(offer.type === 'bid' ? 'form.paymentMethod' : 'match.selectedPaymentMethod')}:
          </Headline>
          <Selector
            style={tw`mt-2`}
            selectedValue={selectedPaymentMethod}
            items={paymentMethodSelectorItems}
            onChange={setPaymentMethod}
          />
        </View>
      </View>
    </Shadow>
  )
}

export default Match
