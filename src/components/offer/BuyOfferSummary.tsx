import { useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import { PaymentMethod } from '../matches/PaymentMethod'
import { CurrencySelection } from '../navigation'
import { SatsFormat, Text } from '../text'
import { HorizontalLine } from '../ui'
import { WalletLabel } from './WalletLabel'

type Props = ComponentProps & {
  offer: BuyOffer | BuyOfferDraft
}

export const BuyOfferSummary = ({ offer, style }: Props) => {
  const currencies = getCurrencies(offer.meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  return (
    <View style={[tw`w-full border border-black-5 rounded-2xl p-7 bg-primary-background-light`, style]}>
      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.youAreBuying')}</Text>

      <SatsFormat
        sats={offer.amount[0]}
        containerStyle={tw`self-center`}
        style={tw`font-semibold subtitle-1`}
        satsStyle={tw`font-normal body-s`}
      />
      <Text style={tw`self-center text-black-2`}>&</Text>
      <SatsFormat
        sats={offer.amount[1]}
        containerStyle={tw`self-center`}
        style={tw`font-semibold subtitle-1`}
        satsStyle={tw`font-normal body-s`}
      />

      <HorizontalLine style={tw`w-64 my-4`} />

      <Text style={tw`self-center body-m text-black-2`}>{i18n('offer.summary.withTheseMethods')}</Text>
      <CurrencySelection currencies={currencies} selected={selectedCurrency} select={setSelectedCurrency} />

      <View style={tw`flex-row flex-wrap items-center justify-center mt-3 mb-2`}>
        {offer.meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod key={`buyOfferMethod-${p}`} paymentMethod={p} style={tw`m-1`} />
        ))}
      </View>
      <HorizontalLine style={tw`w-64 my-4`} />
      <Text style={tw`self-center body-m text-black-2`}>{i18n('to')}</Text>
      <WalletLabel label={offer.walletLabel} address={offer.releaseAddress} style={tw`self-center subtitle-1`} />
    </View>
  )
}
