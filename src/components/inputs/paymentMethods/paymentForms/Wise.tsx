import React, { ReactElement, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '.'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { TabbedNavigation, TabbedNavigationItem } from '../../../navigation/TabbedNavigation'
import Input from '../../Input'
import { PhoneInput } from '../../PhoneInput'
import { CurrencySelection, toggleCurrency } from './CurrencySelection'

const tabs: TabbedNavigationItem[] = [
  {
    id: 'email',
    display: i18n('form.email'),
  },
  {
    id: 'phone',
    display: i18n('form.phone'),
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

  let $email = useRef<TextInput>(null).current
  let $phone = useRef<TextInput>(null).current
  let $reference = useRef<TextInput>(null).current

  const anyFieldSet = !!(email || phone)

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

  const isFormValid = () => {
    setDisplayErrors(true)
    return [...labelErrors, ...phoneErrors, ...emailErrors].length === 0
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
          onSubmit={() => $email?.focus()}
          value={label}
          required={!anyFieldSet}
          label={i18n('form.paymentMethodName')}
          placeholder={i18n('form.paymentMethodName.placeholder')}
          autoCorrect={false}
          errorMessage={displayErrors ? labelErrors : undefined}
        />
      </View>
      <TabbedNavigation items={tabs} selected={currentTab} select={setCurrentTab} />
      <View style={tw`mt-2`}>
        {currentTab.id === 'email' && (
          <Input
            onChange={setEmail}
            onSubmit={() => {
              $reference?.focus()
            }}
            reference={(el: any) => ($email = el)}
            value={email}
            required={!phone}
            placeholder={i18n('form.email.placeholder')}
            autoCorrect={false}
            errorMessage={displayErrors ? emailErrors : undefined}
          />
        )}
        {currentTab.id === 'phone' && (
          <PhoneInput
            onChange={setPhone}
            onSubmit={() => $phone?.focus()}
            reference={(el: any) => ($phone = el)}
            value={phone}
            required={!email}
            placeholder={i18n('form.phone.placeholder')}
            autoCorrect={false}
            errorMessage={displayErrors ? phoneErrors : undefined}
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
