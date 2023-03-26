import {
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TextInput } from 'react-native'
import { FormProps } from './PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import Input from '../../Input'
import { SortCodeInput } from '../../SortCodeInput'
import { BankNumberInput } from '../../BankNumberInput'

const beneficiaryRules = { required: true }
const notRequired = { required: false }
const ukBankAccountRules = { required: false, ukBankAccount: true }
const ukSortCodeRules = { required: false, ukSortCode: true }

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

  const buildPaymentData = (): PaymentData & FasterPaymentsData => ({
    id: data?.id || `fasterPayments-${new Date().getTime()}`,
    label,
    type: 'fasterPayments',
    beneficiary,
    ukBankAccount,
    ukSortCode,
    reference,
    currencies: data?.currencies || currencies,
  })

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
        onSubmit={() => $ukBankAccount?.focus()}
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
        onSubmit={() => $ukSortCode?.focus()}
        reference={(el: any) => ($ukBankAccount = el)}
        value={ukBankAccount}
        label={i18n('form.ukBankAccount')}
        placeholder={i18n('form.ukBankAccount.placeholder')}
        autoCorrect={false}
        required={true}
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
