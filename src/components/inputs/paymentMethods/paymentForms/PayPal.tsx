import React, { ReactElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '.'
import { useUserDataStore } from '../../../../store'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import Input from '../../Input'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

// eslint-disable-next-line max-statements
export const PayPal = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [email, setEmail] = useState(data?.email || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)
  const [displayErrors, setDisplayErrors] = useState(false)

  const getWithLabel = useUserDataStore((state) => state.getPaymentDataByLabel)

  let $phone = useRef<TextInput>(null).current
  let $email = useRef<TextInput>(null).current
  let $userName = useRef<TextInput>(null).current
  const anyFieldSet = !!(phone || userName || email)

  const labelRules = {
    required: true,
    duplicate: getWithLabel(label) && getWithLabel(label)!.id !== data.id,
  }
  const phoneRules = { required: !email && !userName, phone: true }
  const emailRules = { required: !phone && !userName, email: true }
  const userNameRules = { required: !phone && !email, userName: true }

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const phoneErrors = useMemo(() => getErrorsInField(phone, phoneRules), [phone, phoneRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])
  const userNameErrors = useMemo(() => getErrorsInField(userName, userNameRules), [userName, userNameRules])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const buildPaymentData = (): PaymentData & PaypalData => ({
    id: data?.id || `paypal-${new Date().getTime()}`,
    label,
    type: 'paypal',
    phone,
    email,
    userName,
    currencies: selectedCurrencies,
  })

  const isFormValid = () => {
    setDisplayErrors(true)
    return [...labelErrors, ...phoneErrors, ...emailErrors, ...userNameErrors].length === 0
  }

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
      <View>
        <Input
          onChange={setLabel}
          onSubmit={() => $phone?.focus()}
          value={label}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          isValid={labelErrors.length === 0}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
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
          required={!anyFieldSet}
          label={i18n('form.phone')}
          placeholder={i18n('form.phone.placeholder')}
          isValid={phoneErrors.length === 0}
          autoCorrect={false}
          errorMessage={displayErrors ? phoneErrors : undefined}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={setEmail}
          onSubmit={() => $userName?.focus()}
          reference={(el: any) => ($email = el)}
          required={!anyFieldSet}
          value={email}
          label={i18n('form.email')}
          placeholder={i18n('form.email.placeholder')}
          isValid={emailErrors.length === 0}
          autoCorrect={false}
          errorMessage={displayErrors ? emailErrors : undefined}
        />
      </View>
      <View style={tw`mt-6`}>
        <Input
          onChange={(usr: string) => {
            setUserName(usr.length && !/@/gu.test(usr) ? `@${usr}` : usr)
          }}
          onSubmit={() => {
            setUserName((usr: string) => (!/@/gu.test(usr) ? `@${usr}` : usr))
            save()
          }}
          reference={(el: any) => ($userName = el)}
          required={!anyFieldSet}
          value={userName}
          label={i18n('form.userName')}
          placeholder={i18n('form.userName.placeholder')}
          isValid={userNameErrors.length === 0}
          autoCorrect={false}
          errorMessage={displayErrors ? userNameErrors : undefined}
        />
      </View>
      <CurrencySelection paymentMethod="paypal" selectedCurrencies={selectedCurrencies} onToggle={onCurrencyToggle} />
    </View>
  )
}
