import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import { getErrorsInField } from '../../../../utils/validation'
import { BankNumberInput } from '../../BankNumberInput'
import { LabelInput } from '../../LabelInput'
import { ReferenceInput } from '../../ReferenceInput'
import { BeneficiaryInput } from '../../BeneficiaryInput'

const beneficiaryRules = { required: true }
const notRequired = { required: false }

export const Template7 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
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

  let $beneficiary = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  const buildPaymentData = useCallback(
    (): PaymentData & StraksbetalingData => ({
      id: data?.id || `${paymentMethod}-${new Date().getTime()}`,
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

  return (
    <>
      <LabelInput
        onChange={setLabel}
        onSubmit={() => $beneficiary?.focus()}
        value={label}
        errorMessage={displayErrors ? labelErrors : undefined}
      />
      <BeneficiaryInput
        onChange={setBeneficiary}
        reference={(el: any) => ($beneficiary = el)}
        value={beneficiary}
        errorMessage={displayErrors ? beneficiaryErrors : undefined}
      />
      <BankNumberInput
        onChange={setAccountNumber}
        onSubmit={() => $reference?.focus()}
        value={accountNumber}
        errorMessage={displayErrors ? accountNumberErrors : undefined}
      />
      <ReferenceInput
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => ($reference = el)}
        value={reference}
        errorMessage={displayErrors ? referenceErrors : undefined}
      />
    </>
  )
}
