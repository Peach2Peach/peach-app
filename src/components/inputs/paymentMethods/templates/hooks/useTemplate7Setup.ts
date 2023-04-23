import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProps } from '../../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import { getPaymentDataByLabel } from '../../../../../utils/account'
import { getErrorsInField } from '../../../../../utils/validation'

const beneficiaryRules = { required: true }
const notRequired = { required: false }
// eslint-disable-next-line max-lines-per-function
export const useTemplate7Setup = ({
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  paymentMethod,
  setFormData,
}: FormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [beneficiary, setBeneficiary, isValidBeneficiary, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [accountNumber, setAccountNumber] = useState(data?.accountNumber || '')
  const [reference, setReference, , referenceErrors] = useValidatedState(data?.reference || '', notRequired)
  const [displayErrors, setDisplayErrors] = useState(false)

  const accountNumberRules = useMemo(() => ({ required: true, [paymentMethod]: true }), [paymentMethod])
  const accountNumberErrors = useMemo(
    () => getErrorsInField(accountNumber, accountNumberRules),
    [accountNumber, accountNumberRules],
  )

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)?.id !== data.id,
    }),
    [data.id, label],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

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
    setDisplayErrors(true)
    return [...labelErrors, ...accountNumberErrors].length === 0 && isValidBeneficiary
  }, [accountNumberErrors, isValidBeneficiary, labelErrors])

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
