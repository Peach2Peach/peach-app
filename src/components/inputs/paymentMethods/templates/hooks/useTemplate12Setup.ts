import { useCallback, useEffect } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useCurrencySelection } from './useCurrencySelection'
import { useLabelInput } from './useLabelInput'
import { usePhoneInput } from './usePhoneInput'
import { useReferenceInput } from './useReferenceInput'

export const useTemplate12Setup = ({ data, setStepValid, setFormData }: Omit<FormProps, 'onSubmit'>) => {
  const { type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const { phoneInputProps, phoneIsValid, setDisplayErrors: setDisplayPhoneErrors, phone } = usePhoneInput(data)
  const {
    referenceInputProps,
    referenceIsValid,
    setDisplayErrors: setDisplayReferenceErrors,
    reference,
  } = useReferenceInput(data)
  const { currencySelectionProps, selectedCurrencies, shouldShowCurrencySelection } = useCurrencySelection(data)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      phone,
      reference,
      currencies: selectedCurrencies,
    }),
    [data?.id, label, paymentMethod, phone, reference, selectedCurrencies],
  )

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayPhoneErrors(true)
    setDisplayReferenceErrors(true)
    return phoneIsValid && labelErrors.length === 0 && referenceIsValid
  }, [
    labelErrors.length,
    phoneIsValid,
    referenceIsValid,
    setDisplayLabelErrors,
    setDisplayPhoneErrors,
    setDisplayReferenceErrors,
  ])

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [buildPaymentData, isFormValid, setFormData, setStepValid])

  return {
    labelInputProps,
    phoneInputProps,
    referenceInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  }
}
