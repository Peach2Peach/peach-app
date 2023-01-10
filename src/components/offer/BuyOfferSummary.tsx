import React, { ReactElement, useState } from 'react'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import Card from '../Card'
import { Selector } from '../inputs'
import { Headline, SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'

type BuyOfferSummaryProps = ComponentProps & {
  offer: BuyOffer
}
export const BuyOfferSummary = ({ offer, style }: BuyOfferSummaryProps): ReactElement => {
  console.log(offer)
  const [currencies] = useState(() => getCurrencies(offer.meansOfPayment))
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [paymentMethods, setPaymentMethods] = useState(offer.meansOfPayment[selectedCurrency]!)

  const setCurrency = (c: string) => {
    setSelectedCurrency(c as Currency)
    setPaymentMethods(offer.meansOfPayment[c as Currency]!)
  }

  return (
    <Card style={[tw`pt-7 pb-8 px-5`, style]}>
      <Headline style={tw`text-grey-2 normal-case`}>{i18n('offer.summary.youAreBuying')}</Headline>
      <Text style={tw`text-center`}>
        <SatsFormat sats={offer.amount} color={tw`text-grey-2`} />
      </Text>
      <HorizontalLine style={tw`mt-4`} />
      <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('offer.summary.in')}</Headline>
      <Selector
        style={tw`mt-2`}
        selectedValue={selectedCurrency}
        onChange={setCurrency}
        items={getCurrencies(offer.meansOfPayment).map((c) => ({ value: c, display: c }))}
      />
      <HorizontalLine style={tw`mt-4`} />
      <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('offer.summary.via')}</Headline>
      <Selector
        items={paymentMethods.map((p) => ({
          value: p,
          display: i18n(`paymentMethod.${p}`).toLowerCase(),
        }))}
        style={tw`mt-2`}
      />
    </Card>
  )
}
