import React, { ReactElement, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import { HorizontalLine } from '../../../ui'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const Wise = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [iban, setIBAN] = useState(data?.IBAN || '')
  const [bic, setBIC] = useState(data?.bic || '')
  const [reference, setReference] = useState(data?.reference || '')

  let $email = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current
  let $iban = useRef<TextInput>(null).current
  let $bic = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const anyFieldSet = !!(email || (beneficiary && (iban || bic)))

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { label, email, beneficiary, iban, bic },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & WiseData => ({
    id: data?.id || `wise-${new Date().getTime()}`,
    label,
    type: 'wise',
    email,
    beneficiary,
    iban,
    bic,
    currencies: data?.currencies || currencies,
  })

  const validateForm = () => validate({
    label: {
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id
    },
    email: {
      required: !iban && !bic,
      email: true
    },
    beneficiary: {
      required: !email,
    },
    iban: {
      required: !email,
      iban: true
    },
    bic: {
      bic: true
    },
  })

  const save = () => {
    if (!validateForm()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    validateForm,
    save,
  }))

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, email, beneficiary, iban, bic])

  return <View>
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $email?.focus()}
        value={label}
        label={i18n('form.paymentMethodName')}
        placeholder={i18n('form.paymentMethodName.placeholder')}
        isValid={!isFieldInError('label')}
        autoCorrect={false}
        errorMessage={label.length && getErrorsInField('label')}
      />
    </View>
    <HorizontalLine style={tw`mt-6`} />
    <View style={tw`mt-6`}>
      <Input
        onChange={setEmail}
        onSubmit={() => $beneficiary?.focus()}
        reference={(el: any) => $email = el}
        value={email}
        required={!iban}
        label={i18n('form.email')}
        placeholder={i18n('form.email.placeholder')}
        isValid={!isFieldInError('email')}
        autoCorrect={false}
        errorMessage={email.length && getErrorsInField('email')}
      />
    </View>
    <HorizontalLine style={tw`mt-6`} />
    <View style={tw`mt-6`}>
      <Input
        onChange={setBeneficiary}
        onSubmit={() => $iban?.focus()}
        reference={(el: any) => $beneficiary = el}
        required={!anyFieldSet}
        value={beneficiary}
        label={i18n('form.beneficiary')}
        placeholder={i18n('form.beneficiary.placeholder')}
        isValid={!isFieldInError('beneficiary')}
        autoCorrect={false}
        errorMessage={beneficiary.length && getErrorsInField('beneficiary')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={setIBAN}
        onSubmit={() => $bic?.focus()}
        reference={(el: any) => $iban = el}
        required={!email}
        value={iban}
        label={i18n('form.iban')}
        placeholder={i18n('form.iban.placeholder')}
        isValid={!isFieldInError('iban')}
        autoCorrect={false}
        errorMessage={iban.length && getErrorsInField('iban')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={setBIC}
        onSubmit={() => $reference?.focus()}
        reference={(el: any) => $bic = el}
        value={bic}
        label={i18n('form.bic')}
        placeholder={i18n('form.bic.placeholder')}
        isValid={!isFieldInError('bic')}
        autoCorrect={false}
        errorMessage={bic.length && getErrorsInField('bic')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => $reference = el}
        value={reference}
        required={false}
        label={i18n('form.reference')}
        placeholder={i18n('form.reference.placeholder')}
        isValid={!isFieldInError('reference')}
        autoCorrect={false}
        errorMessage={reference.length && getErrorsInField('reference')}
      />
    </View>
  </View>
}