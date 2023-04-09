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
    labelInputProps: {
      value: label,
      onChange: setLabel,
      errorMessage: displayErrors ? labelErrors : undefined,
    },
    beneficiaryInputProps: {
      value: beneficiary,
      onChange: setBeneficiary,
      errorMessage: displayErrors ? beneficiaryErrors : undefined,
    },
    ibanInputProps: {
      value: iban,
      onChange: setIBAN,
      errorMessage: displayErrors ? ibanErrors : undefined,
    },
    bicInputProps: {
      value: bic,
      onChange: setBIC,
      errorMessage: displayErrors ? bicErrors : undefined,
    },
    referenceInputProps: {
      value: reference,
      onChange: setReference,
      errorMessage: displayErrors ? referenceErrors : undefined,
    },
    checkboxProps: {
      checked,
      onPress: toggleChecked,
    },
    currencySelectionProps: {
      paymentMethod,
      onToggle: onCurrencyToggle,
      selectedCurrencies,
    },
    save,
  }
}

export const Template1 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const {
    labelInputProps,
    beneficiaryInputProps,
    ibanInputProps,
    bicInputProps,
    referenceInputProps,
    checkboxProps,
    currencySelectionProps,
    save,
  } = useTemplate1Setup({ data, paymentMethod, onSubmit, setStepValid, currencies, setFormData })

  return (
    <>
      <Input
        {...labelInputProps}
        onSubmit={() => $beneficiary?.focus()}
        label={i18n('form.paymentMethodName')}
        placeholder={i18n('form.paymentMethodName.placeholder')}
        autoCorrect={false}
      />
      <Input
        {...beneficiaryInputProps}
        onSubmit={() => $iban?.focus()}
        reference={(el: any) => ($beneficiary = el)}
        required={true}
        label={i18n('form.beneficiary')}
        placeholder={i18n('form.beneficiary.placeholder')}
        autoCorrect={false}
      />
      <IBANInput
        {...ibanInputProps}
        onSubmit={() => $bic?.focus()}
        reference={(el: any) => ($iban = el)}
        label={i18n('form.iban')}
      />
      <BICInput
        {...bicInputProps}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => ($bic = el)}
        required={true}
        label={i18n('form.bic')}
        placeholder={i18n('form.bic.placeholder')}
        autoCorrect={false}
      />
      <Input
        {...referenceInputProps}
        onSubmit={save}
        reference={(el: any) => ($reference = el)}
        required={false}
        label={i18n('form.reference')}
        placeholder={i18n('form.reference.placeholder')}
        autoCorrect={false}
      />
      {paymentMethod === 'instantSepa' && <Checkbox {...checkboxProps} text={i18n('form.instantSepa.checkbox')} />}
      {hasMultipleAvailableCurrencies(paymentMethod) && <CurrencySelection {...currencySelectionProps} />}
    </>
  )
}
