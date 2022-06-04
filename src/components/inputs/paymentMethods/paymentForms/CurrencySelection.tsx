import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import { getPaymentMethodInfo } from '../../../../utils/paymentMethod'
import { Item } from '../../Item'

export const toggleCurrency = (currency: Currency) => (currencies: Currency[]) => {
  if (currencies.indexOf(currency) === -1) {
    currencies.push(currency)
  } else {
    currencies = currencies.filter(c => c !== currency)
  }
  return [...currencies]
}

type CurrencySelectionProps = ComponentProps & {
  paymentMethod: PaymentMethod,
  selectedCurrencies: Currency[],
  onToggle: (currencies: Currency) => void
}

export const CurrencySelection = ({
  paymentMethod,
  selectedCurrencies,
  onToggle,
  style
}: CurrencySelectionProps): ReactElement => {
  const [paymentMethodInfo] = useState(getPaymentMethodInfo(paymentMethod))

  return <View style={[tw`flex-row justify-center`, style]}>
    {paymentMethodInfo.currencies
      .map((currency, i) => <Item
        key={currency}
        style={i > 0 ? tw`ml-2` : {}}
        label={currency}
        isSelected={selectedCurrencies.indexOf(currency) !== -1}
        onPress={() => selectedCurrencies.indexOf(currency) === -1 || selectedCurrencies.length > 1
          ? onToggle(currency)
          : null
        }
        invertColors={true}
      />)}
  </View>
}