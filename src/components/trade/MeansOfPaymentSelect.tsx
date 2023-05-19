import { useState } from 'react'
import { getCurrencies } from '../../utils/paymentMethod'
import { CurrencySelection } from '../navigation/CurrencySelection'
import tw from '../../styles/tailwind'
import { View } from 'react-native'
import { PaymentMethod } from '../matches/PaymentMethod'

type Props = {
  meansOfPayment: MeansOfPayment
}
export const MeansOfPaymentSelect = ({ meansOfPayment }: Props) => {
  const currencies = getCurrencies(meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  return (
    <View style={tw`gap-3`}>
      <CurrencySelection currencies={currencies} selected={selectedCurrency} select={setSelectedCurrency} />
      <View style={tw`flex-row flex-wrap items-center gap-1`}>
        {meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod key={`meansOfPaymentSelect-${p}`} paymentMethod={p} />
        ))}
      </View>
    </View>
  )
}
