import { useCallback, useEffect } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useLabelInput } from './useLabelInput'
import { useLNURLAddressInput } from './useLNURLAddressInput'

export const useTemplate11Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const {
    lnurlAddressInputProps,
    lnurlAddressErrors,
    setDisplayErrors: setDisplaylnurlAddressErrors,
    lnurlAddress,
  } = useLNURLAddressInput(data)

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplaylnurlAddressErrors(true)
    return labelErrors.length === 0 && lnurlAddressErrors.length === 0
  }, [labelErrors.length, lnurlAddressErrors.length, setDisplayLabelErrors, setDisplaylnurlAddressErrors])

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      lnurlAddress,
      currencies,
    }),
    [currencies, data?.id, label, paymentMethod, lnurlAddress],
  )

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
    lnurlAddressInputProps: {
      ...lnurlAddressInputProps,
      onSubmit: save,
    },
  }
}
