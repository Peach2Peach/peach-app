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
    <>
      <CurrencySelection
        style={[tw`mt-2`, tw.md`mt-4`]}
        currencies={currencies}
        selected={selectedCurrency}
        select={setSelectedCurrency}
      />
      <View style={tw`flex-row flex-wrap items-center mt-3`}>
        {meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod key={`meansOfPaymentSelect-${p}`} paymentMethod={p} style={tw`m-1`} />
        ))}
      </View>
    </>
  )
}
