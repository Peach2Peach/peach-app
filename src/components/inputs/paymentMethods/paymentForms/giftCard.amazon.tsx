import React, { ReactElement, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { PaymentMethodFormProps } from '.'
import { OverlayContext } from '../../../../contexts/overlay'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getMessages, rules } from '../../../../utils/validation'
import Input from '../../Input'
const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export const GiftCardAmazon = ({
  forwardRef,
  data,
  currencies = [],
  countries = [],
  onSubmit,
  onChange
}: PaymentMethodFormProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')

  let $email = useRef<TextInput>(null).current

  const { validate, isFieldInError, getErrorsInField } = useValidation({
    deviceLocale: 'default',
    state: { label, email },
    rules,
    messages: getMessages()
  })

  const buildPaymentData = (): PaymentData & AmazonGiftCardData => ({
    id: data?.id || `giftCard.amazon-${new Date().getTime()}`,
    label,
    type: 'giftCard.amazon',
    email,
    currencies: data?.currencies || currencies,
    countries: data?.countries || countries,
  })

  const validateForm = () => validate({
    label: {
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id
    },
    email: {
      required: true,
      email: true
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
  }, [label, email])

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
    <View style={tw`mt-6`}>
      <Input
        onChange={setEmail}
        onSubmit={save}
        reference={(el: any) => $email = el}
        required={true}
        value={email}
        label={i18n('form.email')}
        placeholder={i18n('form.email.placeholder')}
        isValid={!isFieldInError('email')}
        autoCorrect={false}
        errorMessage={email.length && getErrorsInField('email')}
      />
    </View>
  </View>
}