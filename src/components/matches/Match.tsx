
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Headline, Shadow, Text, HorizontalLine } from '..'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { mildShadow } from '../../utils/layout'
import LanguageContext from '../../contexts/language'
import { Selector } from '../inputs'
import { thousands } from '../../utils/string'
import BitcoinContext, { getBitcoinContext } from '../../contexts/bitcoin'

type MatchProps = ComponentProps & {
  match: Match,
}

/**
 * @description Component to display a match
 * @param match the match
 * @example
 * <Match match={match} />
 */
export const Match = ({ match, style }: MatchProps): ReactElement => {
  useContext(LanguageContext)
  useContext(BitcoinContext)

  const [selectedCurrency, setSelectedCurrency] = useState(Object.keys(match.prices)[0] as Currency)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(match.paymentMethods[0])
  const { price } = getBitcoinContext()

  useEffect(() => {
    setSelectedCurrency('EUR')
  }, [])

  return <Shadow {...mildShadow} viewStyle={[
    tw`border border-grey-4 rounded-md bg-white-1`,
    match.matched ? tw`border-green` : {},
    style
  ]}>
    {match.matched
      ? <Headline style={tw`absolute bottom-full w-full text-center text-green`}>
        {i18n('search.waitingForSeller')}
      </Headline>
      : null
    }
    <View style={[
      tw`p-4`,
      match.matched ? tw`opacity-20` : {},
    ]}>
      <Text>{match.user.id.substring(0, 8)} {match.user.rating ? match.user.rating : null}</Text>
      <HorizontalLine />
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
        {i18n('form.currency')}
      </Headline>
      <Selector
        style={tw`mt-4`}
        selectedValue={selectedCurrency}
        items={Object.keys(match.prices).map(c => ({ value: c, display: c }))}
        onChange={c => setSelectedCurrency(c as Currency)}
      />
      <HorizontalLine style={tw`mt-5`}/>
      <Headline style={tw`mt-4 lowercase text-grey-1`}>
        {i18n('form.paymentMethod')}
      </Headline>
      <Selector
        style={tw`mt-4`}
        selectedValue={selectedPaymentMethod}
        items={match.paymentMethods.concat(['iban', 'giftCard', 'revolut', 'applePay', 'twint', 'wise']).map(p => ({
          value: p,
          display: i18n(`paymentMethod.${p}`)
        }))}
        onChange={c => setSelectedPaymentMethod(c as PaymentMethod)}
      />
      <HorizontalLine style={tw`mt-5`}/>
      {!match.kyc
        ? <Headline style={tw`text-lg text-left`}>{i18n('kycFree')}</Headline>
        : null
      }
    </View>
  </Shadow>
}

export default Match