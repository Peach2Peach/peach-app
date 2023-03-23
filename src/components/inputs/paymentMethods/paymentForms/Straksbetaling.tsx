import React, { ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from './PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { BankNumberInput } from '../../BankNumberInput'
import Input from '../../Input'

const beneficiaryRules = { required: true }
const notRequired = { required: false }

export const Straksbetaling = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  paymentMethod,
}: FormProps): ReactElement => {
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

  const buildPaymentData = (): PaymentData & StraksbetalingData => ({
    id: data?.id || `straksbetaling-${new Date().getTime()}`,
    label,
    type: 'straksbetaling',
    beneficiary,
    accountNumber,
    reference,
    currencies: data?.currencies || currencies,
  })

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return [...labelErrors, ...accountNumberErrors].length === 0 && isValidBeneficiary
  }, [accountNumberErrors, isValidBeneficiary, labelErrors])

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    save,
  }))

  useEffect(() => {
    setStepValid(isFormValid())
  }, [isFormValid, setStepValid])

  return (
    <>
      <Input
        onChange={setLabel}
        onSubmit={() => $beneficiary?.focus()}
        value={label}
        label={i18n('form.paymentMethodName')}
        placeholder={i18n('form.paymentMethodName.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? labelErrors : undefined}
      />
      <Input
        onChange={setBeneficiary}
        reference={(el: any) => ($beneficiary = el)}
        value={beneficiary}
        required={true}
        label={i18n('form.beneficiary')}
        placeholder={i18n('form.beneficiary.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? beneficiaryErrors : undefined}
      />
      <BankNumberInput
        onChange={setAccountNumber}
        onSubmit={() => $reference?.focus()}
        value={accountNumber}
        required={true}
        label={i18n('form.account.long')}
        placeholder={i18n('form.account.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? accountNumberErrors : undefined}
      />
      <Input
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => ($reference = el)}
        value={reference}
        required={false}
        label={i18n('form.reference')}
        placeholder={i18n('form.reference.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? referenceErrors : undefined}
      />
    </>
  )
}
