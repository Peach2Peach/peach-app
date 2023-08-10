import { useState } from 'react'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { toggleCurrency } from '../../paymentForms/utils'

export const useCurrencySelection = ({
  type: paymentMethod,
  currencies,
}: {
  type: PaymentMethod
  currencies: Currency[]
}) => {
  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  return {
    currencySelectionProps: {
      paymentMethod,
      selectedCurrencies,
      onToggle: onCurrencyToggle,
    },
    selectedCurrencies,
    shouldShowCurrencySelection: hasMultipleAvailableCurrencies(paymentMethod),
  }
}
