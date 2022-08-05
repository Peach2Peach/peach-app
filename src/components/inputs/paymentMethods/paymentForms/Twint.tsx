import React, { ReactElement, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const Twint = ({
  forwardRef,
  data,
  currencies = [],
  onSubmit,
  onChange
}: PaymentMethodFormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')

  let $phone = useRef<TextInput>(null).current
  let $beneficiary = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { label, phone, beneficiary },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & TwintData => ({
    id: data?.id || `twint-${new Date().getTime()}`,
    label,
    type: 'twint',
    phone,
    beneficiary,
    currencies: data?.currencies || currencies,
  })

  const validateForm = () => validate({
    label: {
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id
    },
    phone: {
      required: true,
      phone: true,
    }
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
  }, [label, phone, beneficiary])

  return <View>
    <View>
      <Input
        onChange={setLabel}
        onSubmit={() => $phone?.focus()}
        value={label}
        label={i18n('form.paymentMethodName')}
        placeholder={i18n('form.paymentMethodName.placeholder')}
        isValid={!isFieldInError('label')}
        autoCorrect={false}
        errorMessage={label.length && getErrorsInField('label')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={(number: string) => {
          setPhone((number.length && !/\+/ug.test(number) ? `+${number}` : number).replace(/[^0-9+]/ug, ''))
        }}
        onSubmit={() => {
          setPhone((number: string) => (!/\+/ug.test(number) ? `+${number}` : number).replace(/[^0-9+]/ug, ''))
          $beneficiary?.focus()
        }}
        reference={(el: any) => $phone = el}
        value={phone}
        label={i18n('form.phone')}
        placeholder={i18n('form.phone.placeholder')}
        isValid={!isFieldInError('phone')}
        autoCorrect={false}
        errorMessage={phone.length && getErrorsInField('phone')}
      />
    </View>
    <View style={tw`mt-6`}>
      <Input
        onChange={setBeneficiary}
        onSubmit={save}
        reference={(el: any) => $beneficiary = el}
        value={beneficiary}
        required={false}
        label={i18n('form.name')}
        placeholder={i18n('form.name.placeholder')}
        isValid={!isFieldInError('beneficiary')}
        autoCorrect={false}
        errorMessage={beneficiary.length && getErrorsInField('beneficiary')}
      />
    </View>
  </View>
}