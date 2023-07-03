import { useCallback, useEffect } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useLabelInput } from './useLabelInput'
import { useReceiveAddressInput } from './useReceiveAddressInput'

export const useTemplate10Setup = ({
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  paymentMethod,
  setFormData,
}: FormProps) => {
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const {
    receiveAddressInputProps,
    receiveAddressErrors,
    setDisplayErrors: setDisplayReceiveAddressErrors,
    receiveAddress,
  } = useReceiveAddressInput(data)

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayReceiveAddressErrors(true)
    return labelErrors.length === 0 && receiveAddressErrors.length === 0
  }, [labelErrors.length, receiveAddressErrors.length, setDisplayLabelErrors, setDisplayReceiveAddressErrors])

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      receiveAddress,
      currencies,
    }),
    [currencies, data?.id, label, paymentMethod, receiveAddress],
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
    receiveAddressInputProps: {
      ...receiveAddressInputProps,
      onSubmit: save,
    },
  }
}
