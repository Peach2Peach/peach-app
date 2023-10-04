import { useCallback, useEffect, useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { toggleCurrency } from '../../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { useBeneficiaryInput } from './useBeneficiaryInput'
import { useLabelInput } from './useLabelInput'

const referenceRules = { required: false, isValidPaymentReference: true }
const ibanRules = { required: true, iban: true, isEUIBAN: true }
const bicRules = { required: true, bic: true }

// eslint-disable-next-line max-lines-per-function
export const useTemplate1Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const {
    beneficiaryInputProps,
    beneficiaryIsValid,
    setDisplayErrors: setDisplayBeneficiaryErrors,
    beneficiary,
  } = useBeneficiaryInput(data)
  const [iban, setIBAN, ibanIsValid, ibanErrors] = useValidatedState(data?.iban || '', ibanRules)
  const [bic, setBIC, bicIsValid, bicErrors] = useValidatedState(data?.bic || '', bicRules)
  const [reference, setReference, referenceIsValid, referenceErrors] = useValidatedState(
    data?.reference || '',
    referenceRules,
  )
  const [displayErrors, setDisplayErrors] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      beneficiary,
      iban,
      bic,
      reference,
      currencies: selectedCurrencies,
    }),
    [bic, data?.id, iban, label, paymentMethod, reference, selectedCurrencies, beneficiary],
  )

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayBeneficiaryErrors(true)
    setDisplayErrors(true)
    return labelErrors.length === 0 && beneficiaryIsValid && ibanIsValid && bicIsValid && referenceIsValid
  }, [
    beneficiaryIsValid,
    bicIsValid,
    ibanIsValid,
    labelErrors.length,
    referenceIsValid,
    setDisplayBeneficiaryErrors,
    setDisplayLabelErrors,
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
    beneficiaryInputProps,
    ibanInputProps: {
      value: iban,
      onChange: setIBAN,
      label: i18n('form.iban'),
      errorMessage: displayErrors ? ibanErrors : undefined,
    },
    bicInputProps: {
      value: bic,
      onChange: setBIC,
      errorMessage: displayErrors ? bicErrors : undefined,
    },
    referenceInputProps: {
      value: reference,
      onChange: setReference,
      onSubmit: save,
      errorMessage: displayErrors ? referenceErrors : undefined,
    },
    currencySelectionProps: {
      paymentMethod,
      onToggle: onCurrencyToggle,
      selectedCurrencies,
    },
    shouldShowCurrencySelection: hasMultipleAvailableCurrencies(paymentMethod),
  }
}
