import { NETWORK } from '@env'
import React, { ReactElement, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { showTransaction } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import Icon from '../Icon'
import { PaymentMethod } from '../matches/PaymentMethod'
import { TabbedNavigation } from '../navigation/TabbedNavigation'
import { SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'

type SellOfferSummaryProps = ComponentProps & {
  offer: SellOffer | SellOfferDraft
}
export const SellOfferSummary = ({ offer, style }: SellOfferSummaryProps): ReactElement => {
  const currencies = getCurrencies(offer.meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  return (
    <View style={[tw`border border-black-5 rounded-2xl py-7 px-5`, style]}>
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.youAreSelling')}</Text>
      <SatsFormat
        sats={offer.amount}
        color={tw`text-grey-2`}
        containerStyle={tw`self-center`}
        bitcoinLogoStyle={tw`h-4 w-4 mr-1`}
        style={tw`subtitle-1`}
        satsStyle={tw`body-s`}
      />
      <HorizontalLine style={tw`my-4 bg-black-5`} />
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.withA')}</Text>
      <Text style={tw`text-center`}>
        {i18n(offer.premium > 0 ? 'offer.summary.premium' : 'offer.summary.discount', String(Math.abs(offer.premium)))}
      </Text>
      <HorizontalLine style={tw`my-4 bg-black-5`} />
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.withTheseMethods')}</Text>
      <TabbedNavigation
        items={currencies.map((currency) => ({ id: currency, display: currency.toLowerCase() }))}
        selected={{ id: selectedCurrency, display: selectedCurrency }}
        select={(c) => setSelectedCurrency(c.id as Currency)}
      />
      <View style={tw`items-center mt-3 mb-2 flex-row justify-center`}>
        {offer.meansOfPayment[selectedCurrency]?.map((p, i) => (
          <PaymentMethod key={`sellOfferMethod-${p}`} paymentMethodName={p} style={[i > 0 && tw`ml-1`]} />
        ))}
      </View>

      {offer.funding.txIds.length > 0 && (
        <View>
          <HorizontalLine style={tw`my-4 bg-black-5`} />
          <Text style={tw`self-center`}>{i18n(offer.txId ? 'offer.summary.refundTx' : 'offer.summary.escrow')}</Text>
          <Pressable
            style={tw`flex-row items-center justify-center`}
            onPress={() => showTransaction(offer.txId || (offer.funding.txIds[0] as string), NETWORK)}
          >
            <Text>{i18n('escrow.viewInExplorer')}</Text>
            <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color} />
          </Pressable>
        </View>
      )}
      {!!offer.walletLabel && (
        <>
          <HorizontalLine style={tw`my-4 bg-black-5`} />
          <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.refundWallet')}</Text>
          <Text style={tw`self-center subtitle-1`}>{offer.walletLabel}</Text>
        </>
      )}
    </View>
  )
}
