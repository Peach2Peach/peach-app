import React, { ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from './PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import Input from '../../Input'
import { PhoneInput } from '../../PhoneInput'

const beneficiaryRules = { required: false }
const referenceRules = { required: false }
const phoneRules = { phone: true, isPhoneAllowed: true, required: true }

export const Satispay = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone, phoneIsValid, phoneErrors] = useValidatedState(data?.phone || '', phoneRules)
  const [displayErrors, setDisplayErrors] = useState(false)
  const [beneficiary, setBeneficiary, , beneficiaryErrors] = useValidatedState(data?.beneficiary || '', beneficiaryRules)
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)

  let $beneficiary = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current
  let $phone = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  const buildPaymentData = (): PaymentData & SatispayData => ({
    id: data?.id || `satispay-${new Date().getTime()}`,
    label,
    type: 'satispay',
    phone,
    beneficiary,
    reference,
    currencies: data?.currencies || currencies,
  })

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return phoneIsValid && labelErrors.length === 0
  }, [labelErrors.length, phoneIsValid])

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
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $phone?.focus()}
        value={label}
        label={i18n('form.paymentMethodName')}
        placeholder={i18n('form.paymentMethodName.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? labelErrors : undefined}
      />
      <PhoneInput
        onChange={setPhone}
        reference={(el: any) => ($phone = el)}
        onSubmit={() => $beneficiary?.focus()}
        value={phone}
        label={i18n('form.phone')}
        placeholder={i18n('form.phone.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? phoneErrors : undefined}
      />
      <Input
        onChange={setBeneficiary}
        reference={(el: any) => ($beneficiary = el)}
        onSubmit={() => $reference?.focus()}
        value={beneficiary}
        required={false}
        label={i18n('form.beneficiary')}
        placeholder={i18n('form.beneficiary.placeholder')}
        autoCorrect={false}
        errorMessage={displayErrors ? beneficiaryErrors : undefined}
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
        errorMessage={displayErrors ? referenceError : undefined}
      />
    </View>
  )
}
