import { useState } from 'react'
import { View, ViewProps } from 'react-native'
import tw from '../../styles/tailwind'
import { getCurrencies } from '../../utils/paymentMethod'
import { PaymentMethod } from '../matches/PaymentMethod'
import { CurrencySelection } from '../navigation'

type Props = {
  meansOfPayment: MeansOfPayment
  style?: ViewProps['style']
}

export function MeansOfPayment ({ meansOfPayment, style }: Props) {
  const currencies = getCurrencies(meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  return (
    <View style={style}>
      <CurrencySelection currencies={currencies} selected={selectedCurrency} select={setSelectedCurrency} />
      <View style={tw`flex-row flex-wrap items-center justify-center`}>
        {meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod key={`buyOfferMethod-${p}`} paymentMethod={p} style={tw`m-1`} />
        ))}
      </View>
    </View>
  )
}
