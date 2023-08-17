import { useCallback, useEffect, useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { toggleCurrency } from '../../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { useLabelInput } from './useLabelInput'
import { useReferenceInput } from './useReferenceInput'

const beneficiaryRules = { required: true }
const accountNumberRules = { required: true, isCVU: true }

// eslint-disable-next-line max-lines-per-function
export const useTemplate15Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [beneficiary, setBeneficiary, beneficiaryIsValid, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [accountNumber, setAccountNumber, accountNumberIsValid, accountNumberErrors] = useValidatedState(
    data?.accountNumber || '',
    accountNumberRules,
  )
  const {
    referenceInputProps,
    referenceIsValid,
    setDisplayErrors: setDisplayReferenceErrors,
    reference,
  } = useReferenceInput(data)
  const [displayErrors, setDisplayErrors] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      beneficiary,
      accountNumber,
      reference,
      currencies: selectedCurrencies,
    }),
    [data?.id, paymentMethod, label, beneficiary, accountNumber, reference, selectedCurrencies],
  )

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    setDisplayReferenceErrors(true)
    return labelErrors.length === 0 && beneficiaryIsValid && accountNumberIsValid && referenceIsValid
  }, [
    setDisplayLabelErrors,
    setDisplayReferenceErrors,
    labelErrors.length,
    beneficiaryIsValid,
    accountNumberIsValid,
    referenceIsValid,
  ])

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
      label: i18n('form.account'),
      errorMessage: displayErrors ? accountNumberErrors : undefined,
    },
    referenceInputProps,
    currencySelectionProps: {
      paymentMethod,
      onToggle: onCurrencyToggle,
      selectedCurrencies,
    },
    shouldShowCurrencySelection: hasMultipleAvailableCurrencies(paymentMethod),
  }
}
