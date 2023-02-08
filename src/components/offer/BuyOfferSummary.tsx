import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import { PaymentMethod } from '../matches/PaymentMethod'
import { TabbedNavigation } from '../navigation/TabbedNavigation'
import { SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'

type BuyOfferSummaryProps = ComponentProps & {
  offer: BuyOffer | BuyOfferDraft
}

export const BuyOfferSummary = ({ offer, style }: BuyOfferSummaryProps): ReactElement => {
  const currencies = getCurrencies(offer.meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  return (
    <View style={[tw`border border-black-5 rounded-2xl p-7`, style]}>
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.youAreBuying')}</Text>

      <SatsFormat
        sats={offer.amount[0]}
        containerStyle={tw`self-center`}
        style={tw`font-semibold subtitle-1`}
        satsStyle={tw`body-s font-normal`}
      />
      <Text style={tw`self-center text-black-2`}>&</Text>
      <SatsFormat
        sats={offer.amount[1]}
        containerStyle={tw`self-center`}
        style={tw`font-semibold subtitle-1`}
        satsStyle={tw`body-s font-normal`}
      />

      <HorizontalLine style={tw`w-64 my-4 bg-black-5`} />

      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.withTheseMethods')}</Text>
      <TabbedNavigation
        items={currencies.map((currency) => ({ id: currency, display: currency.toLowerCase() }))}
        selected={{ id: selectedCurrency, display: selectedCurrency }}
        select={(c) => setSelectedCurrency(c.id as Currency)}
      />
      <View style={tw`items-center mt-3 mb-2 flex-row justify-center`}>
        {offer.meansOfPayment[selectedCurrency]?.map((p, i) => (
          <PaymentMethod
            key={`sellOfferMethod-${p}`}
            paymentMethodName={i18n(`paymentMethod.${p}`)}
            style={[i > 0 && tw`ml-1`]}
          />
        ))}
      </View>
      {!!offer.walletLabel && (
        <>
          <HorizontalLine style={tw`w-64 my-4 bg-black-5`} />

          <Text style={tw`self-center body-m text-black-2`}>{i18n('to')}</Text>
          <Text style={tw`self-center subtitle-1`}>{offer.walletLabel}</Text>
        </>
      )}
    </View>
  )
}
