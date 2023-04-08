import { ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
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

export const Template1 = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  name,
}: FormProps & { name: 'sepa' | 'instantSepa' }): ReactElement => {
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

  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
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

  const buildPaymentData = () => ({
    id: data?.id || `${name}-${new Date().getTime()}`,
    label,
    type: name,
    beneficiary,
    iban,
    bic,
    reference,
    currencies: selectedCurrencies,
  })

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
      && (checked || name !== 'instantSepa')
    )
  }, [beneficiaryIsValid, bicIsValid, checked, ibanIsValid, labelErrors.length, name, referenceIsValid])

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
      {name === 'instantSepa' && (
        <Checkbox checked={checked} onPress={toggleChecked} text={i18n('form.instantSepa.checkbox')} />
      )}
      {hasMultipleAvailableCurrencies(name) && (
        <CurrencySelection paymentMethod={name} selectedCurrencies={selectedCurrencies} onToggle={onCurrencyToggle} />
      )}
    </>
  )
}
