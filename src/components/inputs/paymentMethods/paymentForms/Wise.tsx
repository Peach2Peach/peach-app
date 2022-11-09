import React, { ReactElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField, validateForm } from '../../../../utils/validation'
import { useValidation } from '../../../../utils/validation/useValidation'
import { HorizontalLine } from '../../../ui'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

// eslint-disable-next-line max-lines-per-function
export const Wise = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange,
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [reference, setReference] = useState(data?.reference || '')
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  let $email = useRef<TextInput>(null).current
  let $phone = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const anyFieldSet = !!(email || phone)

  const { isFieldInError } = useValidation({ label, email, phone })

  const labelRules = {
    required: true,
    duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
  }
  const phoneRules = { required: !email, phone: true }
  const emailRules = { required: !phone, email: true }

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const phoneErrors = useMemo(() => getErrorsInField(phone, phoneRules), [phone, phoneRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])

  const buildPaymentData = (): PaymentData & WiseData => ({
    id: data?.id || `wise-${new Date().getTime()}`,
    label,
    type: 'wise',
    email,
    phone,
    currencies: selectedCurrencies,
  })

  const isFormValid = () =>
    validateForm([
      {
        value: label,
        rulesToCheck: labelRules,
      },
      {
        value: email,
        rulesToCheck: emailRules,
      },
      {
        value: phone,
        rulesToCheck: phoneRules,
      },
    ])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const save = () => {
    if (!isFormValid()) return

    if (onSubmit) onSubmit(buildPaymentData())
  }

  useImperativeHandle(forwardRef, () => ({
    buildPaymentData,
    isFormValid,
    save,
  }))

  useEffect(() => {
    if (onChange) onChange(buildPaymentData())
  }, [label, email, phone])

  return (
    <View>
      <View>
        <Input
          onChange={setLabel}
          onSubmit={() => $email?.focus()}
          value={label}
          required={!anyFieldSet}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          isValid={!isFieldInError('label')}
          autoCorrect={false}
          errorMessage={labelErrors}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={setEmail}
          onSubmit={() => $phone?.focus()}
          reference={(el: any) => ($email = el)}
          value={email}
          required={!phone}
          label={i18n('form.email')}
          placeholder={i18n('form.email.placeholder')}
          isValid={!isFieldInError('email')}
          autoCorrect={false}
          errorMessage={emailErrors}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={(number: string) => {
            setPhone((number.length && !/\+/gu.test(number) ? `+${number}` : number).replace(/[^0-9+]/gu, ''))
          }}
          onSubmit={() => {
            setPhone((number: string) => (!/\+/gu.test(number) ? `+${number}` : number).replace(/[^0-9+]/gu, ''))
            $email?.focus()
          }}
          reference={(el: any) => ($phone = el)}
          value={phone}
          required={!email}
          label={i18n('form.phone')}
          placeholder={i18n('form.phone.placeholder')}
          isValid={!isFieldInError('phone')}
          autoCorrect={false}
          errorMessage={phoneErrors}
        />
      </View>
      <HorizontalLine style={tw`mt-6`} />
      <View style={tw`mt-6`}>
        <Input
          onChange={setReference}
          onSubmit={save}
          reference={(el: any) => ($reference = el)}
          value={reference}
          required={false}
          label={i18n('form.reference')}
          placeholder={i18n('form.reference.placeholder')}
          isValid={!isFieldInError('reference')}
          autoCorrect={false}
        />
      </View>
      <CurrencySelection
        style={tw`mt-6`}
        paymentMethod="paypal"
        selectedCurrencies={selectedCurrencies}
        onToggle={onCurrencyToggle}
      />
    </View>
  )
}
