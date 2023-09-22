import { useCallback, useEffect, useState } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { toggleCurrency } from '../../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { useLabelInput } from './useLabelInput'
import { useUsernameInput } from './useUsernameInput'

export const useTemplate19Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, isLabelValid, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const {
    userNameInputProps,
    userName,
    setDisplayErrors: setDisplayUsernameErrors,
    userNameIsValid,
  } = useUsernameInput(data)

  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      userName,
      currencies: selectedCurrencies,
    }),
    [data?.id, paymentMethod, label, userName, selectedCurrencies],
  )

  const onCurrencyToggle = (currency: Currency) => setSelectedCurrencies(toggleCurrency(currency))

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayUsernameErrors(true)
    return isLabelValid && userNameIsValid
  }, [setDisplayLabelErrors, setDisplayUsernameErrors, isLabelValid, userNameIsValid])

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [buildPaymentData, isFormValid, setFormData, setStepValid])

  return {
    labelInputProps,
    userNameInputProps: { ...userNameInputProps, onSubmit: save },
    currencySelectionProps: {
      paymentMethod,
      onToggle: onCurrencyToggle,
      selectedCurrencies,
    },
    shouldShowCurrencySelection: hasMultipleAvailableCurrencies(paymentMethod),
  }
}
