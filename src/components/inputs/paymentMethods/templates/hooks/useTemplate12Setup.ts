import { useCallback, useEffect } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useLabelInput } from './useLabelInput'
import { usePhoneInput } from './usePhoneInput'
import { useCurrencySelection } from './useCurrencySelection'

export const useTemplate12Setup = ({ data, setStepValid, setFormData }: Omit<FormProps, 'onSubmit'>) => {
  const { type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const { phoneInputProps, phoneIsValid, setDisplayErrors: setDisplayPhoneErrors, phone } = usePhoneInput(data)
  const { currencySelectionProps, selectedCurrencies, shouldShowCurrencySelection } = useCurrencySelection(data)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      phone,
      currencies: selectedCurrencies,
    }),
    [data?.id, label, paymentMethod, phone, selectedCurrencies],
  )

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayPhoneErrors(true)
    return phoneIsValid && labelErrors.length === 0
  }, [labelErrors.length, phoneIsValid, setDisplayLabelErrors, setDisplayPhoneErrors])

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [buildPaymentData, isFormValid, setFormData, setStepValid])

  return {
    labelInputProps,
    phoneInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  }
}
