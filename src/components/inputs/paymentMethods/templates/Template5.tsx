import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { SortCodeInput } from '../../SortCodeInput'
import { BankNumberInput } from '../../BankNumberInput'
import { LabelInput } from '../../LabelInput'
import { ReferenceInput } from '../../ReferenceInput'
import { BeneficiaryInput } from '../../BeneficiaryInput'

const beneficiaryRules = { required: true }
const notRequired = { required: false }
const ukBankAccountRules = { required: false, ukBankAccount: true }
const ukSortCodeRules = { required: false, ukSortCode: true }

export const Template5 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
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

  let $beneficiary = useRef<TextInput>(null).current
  let $ukBankAccount = useRef<TextInput>(null).current
  let $ukSortCode = useRef<TextInput>(null).current
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
        onSubmit={() => $ukBankAccount?.focus()}
        reference={(el: any) => ($beneficiary = el)}
        value={beneficiary}
        errorMessage={displayErrors ? beneficiaryErrors : undefined}
      />
      <BankNumberInput
        onChange={setAccountNumber}
        onSubmit={() => $ukSortCode?.focus()}
        reference={(el: any) => ($ukBankAccount = el)}
        value={ukBankAccount}
        label={i18n('form.ukBankAccount')}
        placeholder={i18n('form.ukBankAccount.placeholder')}
        errorMessage={displayErrors ? ukBankAccountErrors : undefined}
      />
      <SortCodeInput
        onChange={setSortCode}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => ($ukSortCode = el)}
        value={ukSortCode}
        required={true}
        label={i18n('form.ukSortCode')}
        placeholder={i18n('form.ukSortCode.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? ukSortCodeErrors : undefined}
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
