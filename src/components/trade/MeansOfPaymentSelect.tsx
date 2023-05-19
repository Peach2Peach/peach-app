import { useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { getCurrencies } from '../../utils/paymentMethod'
import { CustomSelector } from '../inputs/selector'
import { CurrencySelection } from '../navigation/CurrencySelection'
import { PaymentMethodText } from '../paymentMethod/PaymentMethodText'

type Props = {
  meansOfPayment: MeansOfPayment
  selectedPaymentMethod?: PaymentMethod
  setCurrency?: (currency: Currency) => void
  setPaymentMethod?: (paymentMethod: PaymentMethod) => void
  disabled?: boolean
}
export const MeansOfPaymentSelect = ({
  meansOfPayment,
  selectedPaymentMethod,
  setCurrency,
  setPaymentMethod = () => {},
  disabled,
}: Props) => {
  const currencies = getCurrencies(meansOfPayment)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  const updateCurrency = (currency: Currency) => {
    setSelectedCurrency(currency)
    if (setCurrency) setCurrency(currency)
  }
  const paymentMethods = meansOfPayment[selectedCurrency] || []
  const items = paymentMethods.map((p) => ({
    value: p,
    display: (
      <PaymentMethodText
        paymentMethod={p}
        isSelected={p === selectedPaymentMethod}
        isVerified={false}
        textStyle={disabled ? tw`text-black-3` : undefined}
      />
    ),
  }))

  return (
    <View style={tw`gap-3`}>
      <CurrencySelection currencies={currencies} selected={selectedCurrency} select={updateCurrency} />
      <CustomSelector
        {...{
          selectedValue: selectedPaymentMethod,
          items,
          onChange: setPaymentMethod,
          disabled,
        }}
      />
    </View>
  )
}
