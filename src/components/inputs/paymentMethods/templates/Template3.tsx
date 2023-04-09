import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { PhoneInput } from '../../PhoneInput'
import { hasMultipleAvailableCurrencies } from './utils/hasMultipleAvailableCurrencies'
import { CurrencySelection } from '../paymentForms/components'
import { toggleCurrency } from '../paymentForms/utils'
import { LabelInput } from '../../LabelInput'
import { ReferenceInput } from '../../ReferenceInput'
import { BeneficiaryInput } from '../../BeneficiaryInput'

const phoneRules = { required: true, phone: true, isPhoneAllowed: true }

export const Template3 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone, phoneIsValid, phoneErrors] = useValidatedState(data?.phone || '', phoneRules)
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [reference, setReference] = useState(data?.reference || '')
  const [displayErrors, setDisplayErrors] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  let $phone = useRef<TextInput>(null).current
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
    () => ({
      id: data?.id || `${paymentMethod}-${new Date().getTime()}`,
      label,
      type: paymentMethod,
      phone,
      beneficiary,
      reference,
      currencies: selectedCurrencies,
    }),
    [beneficiary, data?.id, label, paymentMethod, phone, reference, selectedCurrencies],
  )

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return phoneIsValid && labelErrors.length === 0
  }, [labelErrors.length, phoneIsValid])

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
        onSubmit={() => $phone?.focus()}
        value={label}
        errorMessage={displayErrors ? labelErrors : undefined}
      />
      <PhoneInput
        onChange={setPhone}
        onSubmit={() => {
          $beneficiary?.focus()
        }}
        reference={(el: any) => ($phone = el)}
        value={phone}
        label={i18n('form.phoneLong')}
        placeholder={i18n('form.phone.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? phoneErrors : undefined}
      />
      <BeneficiaryInput
        onChange={setBeneficiary}
        onSubmit={() => {
          $reference?.focus()
        }}
        reference={(el: any) => ($beneficiary = el)}
        value={beneficiary}
        required={false}
      />
      <ReferenceInput
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => ($reference = el)}
        value={reference}
      />
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
