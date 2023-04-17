import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProps } from '../../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import tw from '../../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../../utils/account'
import i18n from '../../../../../utils/i18n'
import { getErrorsInField } from '../../../../../utils/validation'
import { TabbedNavigationItem } from '../../../../navigation/TabbedNavigation'

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
// eslint-disable-next-line max-lines-per-function
export const useTemplate9Setup = ({
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  paymentMethod,
  setFormData,
}: FormProps) => {
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

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
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
    tabbedNavigationProps: {
      items: tabs,
      selected: currentTab,
      select: setCurrentTab,
      buttonStyle: tw`p-0 mb-2`,
    },
    ibanInputProps: {
      onChange: setIBAN,
      value: iban,
      label: i18n('form.iban.long'),
      errorMessage: displayErrors ? ibanErrors : undefined,
    },
    accountNumberInputProps: {
      onChange: setAccountNumber,
      value: accountNumber,
      errorMessage: displayErrors ? accountNumberErrors : undefined,
    },
    bicInputProps: {
      onChange: setBIC,
      value: bic,
      errorMessage: displayErrors ? bicErrors : undefined,
    },
    referenceInputProps: {
      onChange: setReference,
      onSubmit: save,
      value: reference,
      errorMessage: displayErrors ? referenceErrors : undefined,
    },
    shouldShowIbanInput: currentTab.id === 'iban',
  }
}
