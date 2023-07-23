import { useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import { BTCAmount } from '../bitcoin'
import { PaymentMethod } from '../matches/PaymentMethod'
import { CurrencySelection } from '../navigation'
import { FixedHeightText, Text } from '../text'
import { HorizontalLine } from '../ui'
import { WalletLabel } from './WalletLabel'

type Props = ComponentProps & {
  offer: BuyOffer | BuyOfferDraft
}

export const BuyOfferSummary = ({ offer, style }: Props) => {
  const currencies = getCurrencies(offer.meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  return (
    <View
      style={[tw`items-center gap-4 px-5 border border-black-5 rounded-2xl py-7 bg-primary-background-light`, style]}
    >
      <View style={tw`items-center gap-1`}>
        <Text style={tw`text-center text-black-2`}>{i18n('offer.summary.youAreBuying')}</Text>

        <View style={tw`gap-2`}>
          <BTCAmount size="small" amount={offer.amount[0]} />
          <FixedHeightText height={10} style={tw`text-center text-black-2`}>
            &
          </FixedHeightText>
          <BTCAmount size="small" amount={offer.amount[1]} />
        </View>
      </View>

      <HorizontalLine />

      <View style={tw`gap-1`}>
        <Text style={tw`text-center text-black-2`}>{i18n('offer.summary.withTheseMethods')}</Text>

        <CurrencySelection currencies={currencies} selected={selectedCurrency} select={setSelectedCurrency} />
        <View style={tw`flex-row flex-wrap items-center justify-center`}>
          {offer.meansOfPayment[selectedCurrency]?.map((p) => (
            <PaymentMethod key={`buyOfferMethod-${p}`} paymentMethod={p} style={tw`m-1`} />
          ))}
        </View>
      </View>

      <HorizontalLine />

      <View style={tw`gap-1`}>
        <Text style={tw`text-center text-black-2`}>{i18n('to')}</Text>
        <Text style={tw`text-center subtitle-1`}>
          <WalletLabel label={offer.walletLabel} address={offer.releaseAddress} />
        </Text>
      </View>
    </View>
  )
}
