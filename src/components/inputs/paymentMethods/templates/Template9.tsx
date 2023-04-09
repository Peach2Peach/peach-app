import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { TabbedNavigation } from '../../../navigation'
import { TabbedNavigationItem } from '../../../navigation/TabbedNavigation'
import { BankNumberInput } from '../../BankNumberInput'
import { BICInput } from '../../BICInput'
import { IBANInput } from '../../IBANInput'
import Input from '../../Input'
import { LabelInput } from '../../LabelInput'

const beneficiaryRules = { required: true }
const notRequired = { required: false }
const tabs: TabbedNavigationItem[] = [
  {
    id: 'iban',
    display: i18n('form.iban'),
  },
  {
    id: 'account',
    display: i18n('form.account'),
  },
]

// eslint-disable-next-line max-statements
export const Template9 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [beneficiary, setBeneficiary, , beneficiaryErrors] = useValidatedState(data?.beneficiary || '', beneficiaryRules)

  const [iban, setIBAN] = useState(data?.iban || '')
  const [accountNumber, setAccountNumber] = useState(data?.accountNumber || '')
  const [bic, setBIC] = useState(data?.bic || '')
  const [reference, setReference, , referenceErrors] = useValidatedState(data?.reference || '', notRequired)
  const [displayErrors, setDisplayErrors] = useState(false)

  const [currentTab, setCurrentTab] = useState(tabs[0])

  const ibanRules = useMemo(() => ({ required: !accountNumber, iban: true, isEUIBAN: true }), [accountNumber])
  const accountNumberRules = useMemo(() => ({ required: !iban, [paymentMethod]: true }), [iban, paymentMethod])
  const bicRules = useMemo(() => ({ required: !accountNumber, bic: true }), [accountNumber])

  const ibanErrors = useMemo(() => getErrorsInField(iban, ibanRules), [iban, ibanRules])
  const bicErrors = useMemo(() => getErrorsInField(bic, bicRules), [bic, bicRules])
  const accountNumberErrors = useMemo(
    () => getErrorsInField(accountNumber, accountNumberRules),
    [accountNumber, accountNumberRules],
  )

  let $beneficiary = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
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
    (): PaymentData & NationalTransferData => ({
      id: data?.id || `${paymentMethod}-${new Date().getTime()}`,
      label,
      type: paymentMethod,
      beneficiary,
      iban,
      accountNumber,
      bic,
      reference,
      currencies: data?.currencies || currencies,
    }),
    [data?.id, data?.currencies, paymentMethod, label, beneficiary, iban, accountNumber, bic, reference, currencies],
  )

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return [...labelErrors, ...ibanErrors, ...accountNumberErrors, ...bicErrors].length === 0
  }, [accountNumberErrors, bicErrors, ibanErrors, labelErrors])

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
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} buttonStyle={tw`p-0 mb-2`} />
      {currentTab.id === 'iban' ? (
        <IBANInput
          onChange={setIBAN}
          onSubmit={() => $bic?.focus()}
          value={iban}
          label={i18n('form.iban.long')}
          errorMessage={displayErrors ? ibanErrors : undefined}
        />
      ) : (
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
      )}
      {currentTab.id === 'iban' && (
        <BICInput
          onChange={setBIC}
          onSubmit={() => $reference?.focus()}
          reference={(el: any) => ($bic = el)}
          value={bic}
          errorMessage={displayErrors ? bicErrors : undefined}
        />
      )}
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
