import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProps } from '../../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import { getPaymentDataByLabel } from '../../../../../utils/account'
import { getErrorsInField } from '../../../../../utils/validation'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { toggleCurrency } from '../../paymentForms/utils'

const phoneRules = { required: true, phone: true, isPhoneAllowed: true }

// eslint-disable-next-line max-lines-per-function
export const useTemplate3Setup = ({
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  paymentMethod,
  setFormData,
}: FormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone, phoneIsValid, phoneErrors] = useValidatedState(data?.phone || '', phoneRules)
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [reference, setReference] = useState(data?.reference || '')
  const [displayErrors, setDisplayErrors] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

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

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return phoneIsValid && labelErrors.length === 0
  }, [labelErrors.length, phoneIsValid])

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [buildPaymentData, isFormValid, setFormData, setStepValid])

  return {
    labelInputProps: {
      onChange: setLabel,
      value: label,
      errorMessage: displayErrors ? labelErrors : undefined,
    },
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
      value: reference,
      onSubmit: save,
    },
    currencySelectionProps: {
      paymentMethod,
      selectedCurrencies,
      onToggle: onCurrencyToggle,
    },
    shouldShowCurrencySelection: hasMultipleAvailableCurrencies(paymentMethod),
  }
}
