import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { useToggleBoolean, useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { BICInput } from '../../BICInput'
import { IBANInput } from '../../IBANInput'
import Input from '../../Input'
import { Checkbox } from '../../Checkbox'
import { hasMultipleAvailableCurrencies } from './utils/hasMultipleAvailableCurrencies'
import { CurrencySelection } from '../paymentForms/components'
import { toggleCurrency } from '../paymentForms/utils'

const beneficiaryRules = { required: true }
const notRequired = { required: false }
const ibanRules = { required: true, iban: true, isEUIBAN: true }
const bicRules = { required: true, bic: true }

const useTemplate1Setup = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [checked, toggleChecked] = useToggleBoolean(!!data.id)
  const [beneficiary, setBeneficiary, beneficiaryIsValid, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [iban, setIBAN, ibanIsValid, ibanErrors] = useValidatedState(data?.iban || '', ibanRules)
  const [bic, setBIC, bicIsValid, bicErrors] = useValidatedState(data?.bic || '', bicRules)
  const [reference, setReference, referenceIsValid, referenceErrors] = useValidatedState(
    data?.reference || '',
    notRequired,
  )
  const [displayErrors, setDisplayErrors] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const $beneficiary = useRef<TextInput>(null).current
  const $iban = useRef<TextInput>(null).current
  const $bic = useRef<TextInput>(null).current
  const $reference = useRef<TextInput>(null).current

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
      id: data?.id || `${paymentMethod}-${new Date().getTime()}`,
      label,
      type: paymentMethod,
      beneficiary,
      iban,
      bic,
      reference,
      currencies: selectedCurrencies,
    }),
    [bic, data?.id, iban, label, paymentMethod, reference, selectedCurrencies, beneficiary],
  )

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return (
      labelErrors.length === 0
      && beneficiaryIsValid
      && ibanIsValid
      && bicIsValid
      && referenceIsValid
      && (checked || paymentMethod !== 'instantSepa')
    )
  }, [beneficiaryIsValid, bicIsValid, checked, ibanIsValid, labelErrors.length, paymentMethod, referenceIsValid])

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [buildPaymentData, isFormValid, setFormData, setStepValid])

  return {
    label,
    setLabel,
    checked,
    toggleChecked,
    beneficiary,
    setBeneficiary,
    iban,
    setIBAN,
    bic,
    setBIC,
    reference,
    setReference,
    displayErrors,
    selectedCurrencies,
    onCurrencyToggle,
    save,
    $beneficiary,
    $iban,
    $bic,
    $reference,
    labelErrors,
    beneficiaryErrors,
    ibanErrors,
    bicErrors,
    referenceErrors,
  }
}

export const Template1 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const {
    label,
    setLabel,
    checked,
    toggleChecked,
    beneficiary,
    setBeneficiary,
    iban,
    setIBAN,
    bic,
    setBIC,
    reference,
    setReference,
    displayErrors,
    selectedCurrencies,
    onCurrencyToggle,
    save,
    labelErrors,
    beneficiaryErrors,
    ibanErrors,
    bicErrors,
    referenceErrors,
  } = useTemplate1Setup({ data, paymentMethod, onSubmit, setStepValid, currencies, setFormData })
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
        onSubmit={() => $iban?.focus()}
        reference={(el: any) => ($beneficiary = el)}
        value={beneficiary}
        required={true}
        label={i18n('form.beneficiary')}
        placeholder={i18n('form.beneficiary.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? beneficiaryErrors : undefined}
      />
      <IBANInput
        onChange={setIBAN}
        onSubmit={() => $bic?.focus()}
        reference={(el: any) => ($iban = el)}
        value={iban}
        required={true}
        label={i18n('form.iban')}
        placeholder={i18n('form.iban.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? ibanErrors : undefined}
      />
      <BICInput
        onChange={setBIC}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => ($bic = el)}
        value={bic}
        required={true}
        label={i18n('form.bic')}
        placeholder={i18n('form.bic.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? bicErrors : undefined}
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
      {paymentMethod === 'instantSepa' && (
        <Checkbox checked={checked} onPress={toggleChecked} text={i18n('form.instantSepa.checkbox')} />
      )}
      {hasMultipleAvailableCurrencies(paymentMethod) && (
        <CurrencySelection
          paymentMethod={paymentMethod}
          selectedCurrencies={selectedCurrencies}
          onToggle={onCurrencyToggle}
        />
      )}
    </>
  )
}
