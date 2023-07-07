import { useCallback, useEffect, useState } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { useLabelInput } from './useLabelInput'

const beneficiaryRules = { required: true }
const referenceRules = { required: false, isValidPaymentReference: true }
const ukBankAccountRules = { required: false, ukBankAccount: true }
const ukSortCodeRules = { required: false, ukSortCode: true }
// eslint-disable-next-line max-lines-per-function
export const useTemplate5Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [beneficiary, setBeneficiary, beneficiaryIsValid, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [ukBankAccount, setAccountNumber, ukBankAccountIsValid, ukBankAccountErrors] = useValidatedState(
    data?.ukBankAccount || '',
    ukBankAccountRules,
  )
  const [ukSortCode, setSortCode, ukSortCodeIsValid, ukSortCodeErrors] = useValidatedState(
    data?.ukSortCode || '',
    ukSortCodeRules,
  )
  const [reference, setReference, referenceIsValid, referenceErrors] = useValidatedState(
    data?.reference || '',
    referenceRules,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      beneficiary,
      ukBankAccount,
      ukSortCode,
      reference,
      currencies: data?.currencies || currencies,
    }),
    [beneficiary, currencies, data?.currencies, data?.id, label, paymentMethod, reference, ukBankAccount, ukSortCode],
  )

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    return (
      labelErrors.length === 0 && beneficiaryIsValid && ukBankAccountIsValid && ukSortCodeIsValid && referenceIsValid
    )
  }, [
    beneficiaryIsValid,
    labelErrors.length,
    referenceIsValid,
    setDisplayLabelErrors,
    ukBankAccountIsValid,
    ukSortCodeIsValid,
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
      onChange: setBeneficiary,
      value: beneficiary,
      errorMessage: displayErrors ? beneficiaryErrors : undefined,
    },
    ukBankAccountInputProps: {
      onChange: setAccountNumber,
      value: ukBankAccount,
      errorMessage: displayErrors ? ukBankAccountErrors : undefined,
      label: i18n('form.ukBankAccount'),
      placeholder: i18n('form.ukBankAccount.placeholder'),
    },
    ukSortCodeInputProps: {
      onChange: setSortCode,
      value: ukSortCode,
      errorMessage: displayErrors ? ukSortCodeErrors : undefined,
    },
    referenceInputProps: {
      onChange: setReference,
      value: reference,
      errorMessage: displayErrors ? referenceErrors : undefined,
      onSubmit: save,
    },
  }
}
