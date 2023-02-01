import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import Card from '../Card'
import { Selector } from '../inputs'
import { Headline, SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'

type BuyOfferSummaryProps = ComponentProps & {
  offer: BuyOffer | BuyOfferDraft
}
// TODO: Unify with Summary.tsx of the buy flow
export const BuyOfferSummary = ({ offer, style }: BuyOfferSummaryProps): ReactElement => {
  const [currencies] = useState(() => getCurrencies(offer.meansOfPayment))
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [paymentMethods, setPaymentMethods] = useState(offer.meansOfPayment[selectedCurrency]!)

  const setCurrency = (c: string) => {
    setSelectedCurrency(c as Currency)
    setPaymentMethods(offer.meansOfPayment[c as Currency]!)
  }

  return (
    <Card style={[tw`px-5 pb-8 pt-7`, style]}>
      <Headline style={tw`normal-case text-grey-2`}>{i18n('offer.summary.youAreBuying')}</Headline>
      <Text style={tw`text-center`}>
        <SatsFormat sats={offer.amount[0]} color={tw`text-grey-2`} />
      </Text>
      <Text style={tw`text-center`}>
        <SatsFormat sats={offer.amount[1]} color={tw`text-grey-2`} />
      </Text>
      <HorizontalLine style={tw`mt-4`} />
      <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('offer.summary.in')}</Headline>
      <Selector
        style={tw`mt-2`}
        selectedValue={selectedCurrency}
        onChange={setCurrency}
        items={getCurrencies(offer.meansOfPayment).map((c) => ({ value: c, display: c }))}
      />
      <HorizontalLine style={tw`mt-4`} />
      <Headline style={tw`mt-4 normal-case text-grey-2`}>{i18n('offer.summary.via')}</Headline>
      <Selector
        items={paymentMethods.map((p) => ({
          value: p,
          display: i18n(`paymentMethod.${p}`).toLowerCase(),
        }))}
        style={tw`mt-2`}
      />
      {offer.walletLabel && (
        <View>
          <HorizontalLine style={tw`mt-4`} />
          <Text style={tw`mt-4 text-center text-black-2`}>{i18n('to')}</Text>
          <Text style={tw`text-center subtitle-1`}>{offer.walletLabel}</Text>
        </View>
      )}
    </Card>
  )
}
