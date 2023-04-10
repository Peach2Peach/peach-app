import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProps } from '../../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import { getPaymentDataByLabel } from '../../../../../utils/account'
import i18n from '../../../../../utils/i18n'
import { getErrorsInField } from '../../../../../utils/validation'

const beneficiaryRules = { required: true }
const notRequired = { required: false }
const ukBankAccountRules = { required: false, ukBankAccount: true }
const ukSortCodeRules = { required: false, ukSortCode: true }
// eslint-disable-next-line max-lines-per-function
export const useTemplate5Setup = ({
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  paymentMethod,
  setFormData,
}: FormProps) => {
  const [label, setLabel] = useState(data?.label || '')
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
    notRequired,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  const buildPaymentData = useCallback(
    (): PaymentData & FasterPaymentsData => ({
      id: data?.id || `${paymentMethod}-${new Date().getTime()}`,
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
    setDisplayErrors(true)
    return (
      labelErrors.length === 0 && beneficiaryIsValid && ukBankAccountIsValid && ukSortCodeIsValid && referenceIsValid
    )
  }, [beneficiaryIsValid, labelErrors.length, referenceIsValid, ukBankAccountIsValid, ukSortCodeIsValid])

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
