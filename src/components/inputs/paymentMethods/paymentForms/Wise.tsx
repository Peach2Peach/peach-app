import React, { ReactElement, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from './PaymentMethodForm'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { TabbedNavigation, TabbedNavigationItem } from '../../../navigation/TabbedNavigation'
import { EmailInput } from '../../EmailInput'
import Input from '../../Input'
import { PhoneInput } from '../../PhoneInput'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'phone',
    display: i18n('form.phone'),
  },
  {
    id: 'email',
    display: i18n('form.email'),
  },
]

export const Wise = ({ forwardRef, data, currencies = [], onSubmit, setStepValid }: FormProps): ReactElement => {
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [reference, setReference] = useState(data?.reference || '')
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)
  const [displayErrors, setDisplayErrors] = useState(false)

  const [currentTab, setCurrentTab] = useState(tabs[0])

  const $email = useRef<TextInput>(null).current
  const $phone = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )
  const phoneRules = useMemo(() => ({ required: !email, phone: true, isPhoneAllowed: true }), [email])
  const emailRules = useMemo(() => ({ required: !phone, email: true }), [phone])

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const phoneErrors = useMemo(() => getErrorsInField(phone, phoneRules), [phone, phoneRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])

  const buildPaymentData = (): PaymentData & WiseData => ({
    id: data?.id || `wise-${new Date().getTime()}`,
    label,
    type: 'wise',
    email,
    phone,
    reference,
    currencies: selectedCurrencies,
  })

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return [...labelErrors, ...phoneErrors, ...emailErrors].length === 0
  }, [emailErrors, labelErrors, phoneErrors])

  const getErrorTabs = () => {
    const fields = []
    if (phone && phoneErrors.length > 0) fields.push('phone')
    if (email && emailErrors.length > 0) fields.push('email')
    return fields
  }

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
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
          onSubmit={() => {
            if (currentTab.id === 'email') {
              $email?.focus()
            } else $phone?.focus()
          }}
          value={label}
          required={true}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
        />
      </View>
      <TabbedNavigation
        items={tabs}
        selected={currentTab}
        select={setCurrentTab}
        buttonStyle={tw`p-0`}
        tabHasError={displayErrors ? getErrorTabs() : []}
      />
      <View style={tw`mt-2`}>
        {currentTab.id === 'phone' && (
          <PhoneInput
            onChange={setPhone}
            onSubmit={() => {
              $reference?.focus()
            }}
            value={phone}
            required={!email}
            label={i18n('form.phoneLong')}
            placeholder={i18n('form.phone.placeholder')}
            autoCorrect={false}
            errorMessage={displayErrors ? phoneErrors : undefined}
          />
        )}
        {currentTab.id === 'email' && (
          <EmailInput
            onChange={setEmail}
            onSubmit={() => $reference?.focus()}
            value={email}
            required={!phone}
            label={i18n('form.emailLong')}
            placeholder={i18n('form.email.placeholder')}
            errorMessage={displayErrors ? emailErrors : undefined}
          />
        )}
      </View>
      <View style={tw`mt-1`}>
        <Input
          onChange={setReference}
          onSubmit={save}
          reference={(el: any) => ($reference = el)}
          value={reference}
          required={false}
          label={i18n('form.reference')}
          placeholder={i18n('form.reference.placeholder')}
          autoCorrect={false}
        />
      </View>
      <CurrencySelection
        style={tw`mt-6`}
        paymentMethod="wise"
        selectedCurrencies={selectedCurrencies}
        onToggle={onCurrencyToggle}
      />
    </View>
  )
}
