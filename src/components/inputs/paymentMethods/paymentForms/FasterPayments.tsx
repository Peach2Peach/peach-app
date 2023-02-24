import React, { ReactElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '.'
import { useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { IBANInput } from '../../IBANInput'
import Input from '../../Input'
import { SortCodeInput } from '../../SortCodeInput'

const beneficiaryRules = { required: true }
const notRequired = { required: false }
const accountNumberRules = { required: false, accountNumber: true, isEUACCOUNTNUMBER: true }
const sortCodeRules = { required: false, bic: true }

export const FasterPayments = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  setStepValid,
}: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [beneficiary, setBeneficiary, beneficiaryIsValid, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [accountNumber, setAccountNumber, accountNumberIsValid, accountNumberErrors] = useValidatedState(
    data?.accountNumber || '',
    accountNumberRules,
  )
  const [sortCode, setSortCode, sortCodeIsValid, sortCodeErrors] = useValidatedState(data?.sortCode || '', sortCodeRules)
  const [reference, setReference, referenceIsValid, referenceErrors] = useValidatedState(
    data?.reference || '',
    notRequired,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  let $beneficiary = useRef<TextInput>(null).current
  let $accountNumber = useRef<TextInput>(null).current
  let $sortCode = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const labelRules = {
    required: true,
    duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
  }

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  const buildPaymentData = (): PaymentData & FasterPaymentsData => ({
    id: data?.id || `sepa-${new Date().getTime()}`,
    label,
    type: 'sepa',
    beneficiary,
    accountNumber,
    sortCode,
    reference,
    currencies: data?.currencies || currencies,
  })

  const isFormValid = () => {
    setDisplayErrors(true)
    return labelErrors.length === 0 && beneficiaryIsValid && accountNumberIsValid && sortCodeIsValid && referenceIsValid
  }

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
        onSubmit={() => $accountNumber?.focus()}
        reference={(el: any) => ($beneficiary = el)}
        value={beneficiary}
        label={i18n('form.beneficiary')}
        placeholder={i18n('form.beneficiary.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? beneficiaryErrors : undefined}
      />
      <IBANInput
        onChange={setAccountNumber}
        onSubmit={() => $sortCode?.focus()}
        reference={(el: any) => ($accountNumber = el)}
        value={accountNumber}
        label={i18n('form.accountNumber')}
        placeholder={i18n('form.accountNumber.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? accountNumberErrors : undefined}
      />
      <SortCodeInput
        onChange={setSortCode}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => ($sortCode = el)}
        value={sortCode}
        required={true}
        label={i18n('form.sortCode')}
        placeholder={i18n('form.sortCode.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? sortCodeErrors : undefined}
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
