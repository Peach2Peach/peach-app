import { useCallback, useEffect, useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useLabelInput } from './useLabelInput'

const pixAliasRules = { required: true }

export const useTemplate22Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { type: paymentMethod, currencies } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [pixAlias, setPixAlpixAlias, pixAliasIsValid, pixAliasErrors] = useValidatedState(
    data?.pixAlias || '',
    pixAliasRules,
  )

  const [displayErrors, setDisplayErrors] = useState(false)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      currencies,
      pixAlias,
    }),
    [data?.id, paymentMethod, label, currencies, pixAlias],
  )

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    return labelErrors.length === 0 && pixAliasIsValid
  }, [labelErrors.length, pixAliasIsValid, setDisplayLabelErrors])

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
    pixAliasInputProps: {
      value: pixAlias,
      required: true,
      onChange: setPixAlpixAlias,
      onSubmit: save,
      errorMessage: displayErrors ? pixAliasErrors : undefined,
    },
  }
}
