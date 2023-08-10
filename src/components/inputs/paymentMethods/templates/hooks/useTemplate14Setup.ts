import { useCallback, useEffect, useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { toggleCurrency } from '../../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { useLabelInput } from './useLabelInput'

const beneficiaryRules = { required: true }
const cbuRules = { required: true, isCBU: true }

export const useTemplate14Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [beneficiary, setBeneficiary, beneficiaryIsValid, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [accountNumber, setAccountNumber, accountNumberIsValid, accountNumberErrors] = useValidatedState(
    data?.accountNumber || '',
    cbuRules,
  )
  const [displayErrors, setDisplayErrors] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      beneficiary,
      accountNumber,
      currencies: selectedCurrencies,
    }),
    [data?.id, accountNumber, label, paymentMethod, selectedCurrencies, beneficiary],
  )

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    return labelErrors.length === 0 && beneficiaryIsValid && accountNumberIsValid
  }, [beneficiaryIsValid, accountNumberIsValid, labelErrors.length, setDisplayLabelErrors])

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
    beneficiaryInputProps: {
      value: beneficiary,
      onChange: setBeneficiary,
      errorMessage: displayErrors ? beneficiaryErrors : undefined,
    },
    accountNumberInputProps: {
      value: accountNumber,
      required: true,
      onChange: setAccountNumber,
      onSubmit: save,
      label: i18n('form.cbu'),
      errorMessage: displayErrors ? accountNumberErrors : undefined,
    },
    currencySelectionProps: {
      paymentMethod,
      onToggle: onCurrencyToggle,
      selectedCurrencies,
    },
    shouldShowCurrencySelection: hasMultipleAvailableCurrencies(paymentMethod),
  }
}
