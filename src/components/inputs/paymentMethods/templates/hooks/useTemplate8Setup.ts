import { useCallback, useEffect, useState } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import { toggleCurrency } from '../../paymentForms/utils'
import { useLabelInput } from './useLabelInput'

const referenceRules = { required: false }
const phoneRules = { required: true, phone: true, isPhoneAllowed: true }
export const useTemplate8Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [phone, setPhone, phoneIsValid, phoneErrors] = useValidatedState(data?.phone || '', phoneRules)
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [displayErrors, setDisplayErrors] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      phone,
      beneficiary,
      reference,
      currencies: selectedCurrencies,
    }),
    [beneficiary, data?.id, label, paymentMethod, phone, reference, selectedCurrencies],
  )

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    return phoneIsValid && labelErrors.length === 0
  }, [labelErrors.length, phoneIsValid, setDisplayLabelErrors])

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
    phoneInputProps: {
      onChange: setPhone,
      value: phone,
      errorMessage: displayErrors ? phoneErrors : undefined,
    },
    beneficiaryInputProps: {
      onChange: setBeneficiary,
      value: beneficiary,
      required: false,
    },
    referenceInputProps: {
      onChange: setReference,
      onSubmit: save,
      value: reference,
      errorMessage: displayErrors ? referenceError : undefined,
    },
    currencySelectionProps: {
      paymentMethod,
      selectedCurrencies,
      onToggle: onCurrencyToggle,
    },
  }
}
