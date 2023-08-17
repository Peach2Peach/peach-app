import { useCallback, useEffect, useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useCurrencySelection } from './useCurrencySelection'
import { useLabelInput } from './useLabelInput'
import { useReferenceInput } from './useReferenceInput'

const beneficiaryRules = { required: true }
const cbuRules = { required: true, isCBU: true }

// eslint-disable-next-line max-lines-per-function
export const useTemplate14Setup = ({ data, setStepValid, setFormData }: Omit<FormProps, 'onSubmit'>) => {
  const { type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [beneficiary, setBeneficiary, beneficiaryIsValid, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [accountNumber, setAccountNumber, accountNumberIsValid, accountNumberErrors] = useValidatedState(
    data?.accountNumber || '',
    cbuRules,
  )
  const {
    referenceInputProps,
    referenceIsValid,
    setDisplayErrors: setDisplayReferenceErrors,
    reference,
  } = useReferenceInput(data)
  const [displayErrors, setDisplayErrors] = useState(false)
  const { currencySelectionProps, shouldShowCurrencySelection, selectedCurrencies } = useCurrencySelection(data)

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

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayReferenceErrors(true)
    setDisplayErrors(true)
    return labelErrors.length === 0 && beneficiaryIsValid && accountNumberIsValid && referenceIsValid
  }, [
    setDisplayLabelErrors,
    setDisplayReferenceErrors,
    labelErrors.length,
    beneficiaryIsValid,
    accountNumberIsValid,
    referenceIsValid,
  ])

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
      label: i18n('form.account'),
      errorMessage: displayErrors ? accountNumberErrors : undefined,
    },
    referenceInputProps,
    currencySelectionProps,
    shouldShowCurrencySelection,
  }
}
