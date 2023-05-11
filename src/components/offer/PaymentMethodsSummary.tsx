import { useState } from 'react'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { getCurrencies } from '../../utils/paymentMethod'
import { TabbedNavigation } from '../navigation'
import { PaymentMethod } from '../matches/PaymentMethod'
import { TradeSeparator } from './TradeSeparator'
import { View } from 'react-native'

type Props = {
  meansOfPayment: MeansOfPayment
}
export const PaymentMethodsSummary = ({ meansOfPayment }: Props) => {
  const currencies = getCurrencies(meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  return (
    <View>
      <TradeSeparator text={i18n('paymentMethods.title')} />
      <TabbedNavigation
        items={currencies.map((currency) => ({ id: currency, display: currency.toLowerCase() }))}
        selected={{ id: selectedCurrency, display: selectedCurrency }}
        select={(c) => setSelectedCurrency(c.id as Currency)}
      />
      <View style={tw`flex-row flex-wrap items-center mt-3`}>
        {meansOfPayment[selectedCurrency]?.map((p) => (
          <PaymentMethod key={`buyOfferMethod-${p}`} paymentMethod={p} style={tw`m-1`} />
        ))}
      </View>
    </View>
  )
}
