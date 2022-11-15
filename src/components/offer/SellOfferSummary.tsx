import { NETWORK } from '@env'
import React, { ReactElement, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import Card from '../Card'
import Icon from '../Icon'
import { Selector } from '../inputs'
import { Headline, SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'

type SellOfferSummaryProps = ComponentProps & {
  offer: SellOffer
}
export const SellOfferSummary = ({ offer, style }: SellOfferSummaryProps): ReactElement => {
  const [currencies] = useState(() => getCurrencies(offer.meansOfPayment))
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [paymentMethods, setPaymentMethods] = useState(offer.meansOfPayment[selectedCurrency]!)

  const setCurrency = (c: string) => {
    setSelectedCurrency(c as Currency)
    setPaymentMethods(offer.meansOfPayment[c as Currency]!)
  }

  return (
    <Card style={[tw`p-5`, style]}>
      <Headline style={tw`text-grey-2 normal-case`}>{i18n('offer.summary.youAreSelling')}</Headline>
      <Text style={tw`text-center`}>
        <SatsFormat sats={offer.amount} color={tw`text-grey-2`} />
      </Text>
      <HorizontalLine style={tw`mt-4`} />
      <Headline style={tw`text-grey-2 normal-case mt-4`}>{i18n('offer.summary.for')}</Headline>
      <Text style={tw`text-center`}>
        {i18n(offer.premium > 0 ? 'offer.summary.premium' : 'offer.summary.discount', String(Math.abs(offer.premium)))}
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
      {offer.funding?.txIds?.length > 0 ? (
        <View>
          <HorizontalLine style={tw`mt-4`} />
          <Headline style={tw`text-grey-2 normal-case mt-4`}>
            {i18n(offer.txId ? 'offer.summary.refundTx' : 'offer.summary.escrow')}
          </Headline>
          <Pressable
            style={tw`flex-row justify-center items-center`}
            onPress={() => showTransaction(offer.txId || (offer.funding.txIds[0] as string), NETWORK)}
          >
            <Text>{i18n('escrow.viewInExplorer')}</Text>
            <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color} />
          </Pressable>
        </View>
      ) : null}
    </Card>
  )
}
