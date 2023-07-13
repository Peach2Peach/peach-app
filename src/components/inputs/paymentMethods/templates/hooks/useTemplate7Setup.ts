import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import { getErrorsInField } from '../../../../../utils/validation'
import { useLabelInput } from './useLabelInput'

const beneficiaryRules = { required: true }
const referenceRules = { required: false, isValidPaymentReference: true }

export const useTemplate7Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [beneficiary, setBeneficiary, isValidBeneficiary, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [accountNumber, setAccountNumber] = useState(data?.accountNumber || '')
  const [reference, setReference, referenceIsValid, referenceErrors] = useValidatedState(
    data?.reference || '',
    referenceRules,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  const accountNumberRules = useMemo(() => ({ required: true, [paymentMethod]: true }), [paymentMethod])
  const accountNumberErrors = useMemo(
    () => getErrorsInField(accountNumber, accountNumberRules),
    [accountNumber, accountNumberRules],
  )

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      beneficiary,
      accountNumber,
      reference,
      currencies: data?.currencies || currencies,
    }),
    [accountNumber, beneficiary, currencies, data?.currencies, data?.id, label, paymentMethod, reference],
  )

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    return [...labelErrors, ...accountNumberErrors].length === 0 && isValidBeneficiary && referenceIsValid
  }, [setDisplayLabelErrors, labelErrors, accountNumberErrors, isValidBeneficiary, referenceIsValid])

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
    accountNumberInputProps: {
      onChange: setAccountNumber,
      value: accountNumber,
      errorMessage: displayErrors ? accountNumberErrors : undefined,
    },
    referenceInputProps: {
      onChange: setReference,
      onSubmit: save,
      value: reference,
      errorMessage: displayErrors ? referenceErrors : undefined,
    },
  }
}
