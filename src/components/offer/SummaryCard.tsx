import { useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import { PaymentMethod } from '../matches/PaymentMethod'
import { CurrencySelection } from '../navigation'
import { Text } from '../text'

export const SummaryCard = ({ children }: ComponentProps) => (
  <View style={tw`items-center gap-4 px-5 border border-black-5 rounded-2xl py-7 bg-primary-background-light`}>
    {children}
  </View>
)

const SummarySection = ({ children }: ComponentProps) => <View style={tw`items-center gap-1`}>{children}</View>

SummaryCard.Section = SummarySection

const PaymentMethods = ({ meansOfPayment }: { meansOfPayment: MeansOfPayment }) => {
  const currencies = getCurrencies(meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  return (
    <SummaryCard.Section>
      <Text style={tw`text-center text-black-2`}>{i18n('offer.summary.withTheseMethods')}</Text>

      <CurrencySelection currencies={currencies} selected={selectedCurrency} select={setSelectedCurrency} />
      <View style={tw`flex-row flex-wrap items-center justify-center`}>
        {meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod key={`buyOfferMethod-${p}`} paymentMethod={p} style={tw`m-1`} />
        ))}
      </View>
    </SummaryCard.Section>
  )
}

SummaryCard.PaymentMethods = PaymentMethods
