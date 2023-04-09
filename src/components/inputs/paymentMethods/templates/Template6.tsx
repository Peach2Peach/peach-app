import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { FormProps } from '../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { getErrorsInField } from '../../../../utils/validation'
import { TabbedNavigation, TabbedNavigationItem } from '../../../navigation/TabbedNavigation'
import { EmailInput } from '../../EmailInput'
import { PhoneInput } from '../../PhoneInput'
import { UsernameInput } from '../../UsernameInput'
import { CurrencySelection } from '../paymentForms/components'
import { toggleCurrency } from '../paymentForms/utils'
import { LabelInput } from '../../LabelInput'
import { ReferenceInput } from '../../ReferenceInput'

const referenceRules = { required: false }

// eslint-disable-next-line max-statements, complexity
export const Template6 = ({ data, currencies = [], onSubmit, setStepValid, paymentMethod, setFormData }: FormProps) => {
  const tabs: TabbedNavigationItem[] = useMemo(() => {
    const tabItems = [
      {
        id: 'phone',
        display: i18n('form.phone'),
      },
      {
        id: 'email',
        display: i18n('form.email'),
      },
    ]
    if (paymentMethod === 'paypal') {
      tabItems.push({
        id: 'userName',
        display: i18n('form.userName'),
      })
    } else if (paymentMethod === 'revolut') {
      tabItems.push({
        id: 'revtag',
        display: i18n('form.revtag'),
      })
    }
    return tabItems
  }, [paymentMethod])
  const [label, setLabel] = useState(data?.label || '')
  const [phone, setPhone] = useState(data?.phone || '')
  const [email, setEmail] = useState(data?.email || '')
  const [userName, setUserName] = useState(data?.userName || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)
  const [displayErrors, setDisplayErrors] = useState(false)

  let $reference = useRef<TextInput>(null).current

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )
  const emailRules = useMemo(() => ({ required: !phone && !userName, email: true }), [phone, userName])
  const userNameRules = useMemo(
    () => ({ required: paymentMethod !== 'wise' && 'paypal', revtag: paymentMethod === 'revolut' }),
    [paymentMethod],
  )
  const phoneRules = useMemo(
    () => ({ phone: true, isPhoneAllowed: true, required: !userName && !email }),
    [email, userName],
  )

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const phoneErrors = useMemo(() => getErrorsInField(phone, phoneRules), [phone, phoneRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])
  const userNameErrors = useMemo(() => getErrorsInField(userName, userNameRules), [userName, userNameRules])

  const [currentTab, setCurrentTab] = useState(tabs[0])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const buildPaymentData = useCallback(
    (): PaymentData & PaypalData => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      phone,
      email,
      userName,
      reference,
      currencies: selectedCurrencies,
    }),
    [data?.id, email, label, paymentMethod, phone, reference, selectedCurrencies, userName],
  )

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)

    return [...labelErrors, ...phoneErrors, ...emailErrors, ...userNameErrors].length === 0
  }, [emailErrors, labelErrors, phoneErrors, userNameErrors])

  const getErrorTabs = () => {
    const fields = []
    if (phone && phoneErrors.length > 0) fields.push('phone')
    if (email && emailErrors.length > 0) fields.push('email')
    if (userName && userNameErrors.length > 0) fields.push(paymentMethod === 'paypal' ? 'userName' : 'revtag')
    return fields
  }

  const save = () => {
    if (!isFormValid()) return
    onSubmit(buildPaymentData())
  }

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [buildPaymentData, isFormValid, setFormData, setStepValid])

  return (
    <View>
      <LabelInput onChange={setLabel} value={label} errorMessage={displayErrors ? labelErrors : undefined} />
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
            label={i18n('form.phoneLong')}
            placeholder={i18n('form.phone.placeholder')}
            autoCorrect={false}
            required={!email && !userName}
            errorMessage={displayErrors ? phoneErrors : undefined}
          />
        )}
        {currentTab.id === 'email' && (
          <EmailInput
            onChange={setEmail}
            onSubmit={() => $reference?.focus()}
            value={email}
            label={i18n('form.emailLong')}
            required={!phone && !userName}
            errorMessage={displayErrors ? emailErrors : undefined}
          />
        )}
        {['userName', 'revtag'].includes(currentTab.id) && (
          <UsernameInput
            {...{
              maxLength: paymentMethod === 'paypal' ? 21 : 17,
              onChange: setUserName,
              onSubmit: $reference?.focus,
              value: userName,
              label: paymentMethod === 'paypal' ? i18n('form.userName') : i18n('form.revtag'),
              placeholder:
                paymentMethod === 'paypal' ? i18n('form.userName.placeholder') : i18n('form.revtag.placeholder'),
              autoCorrect: false,
              required: !phone && !email,
              errorMessage: displayErrors ? userNameErrors : undefined,
            }}
          />
        )}
      </View>

      <ReferenceInput
        onChange={setReference}
        onSubmit={save}
        reference={(el: any) => ($reference = el)}
        value={reference}
        errorMessage={displayErrors ? referenceError : undefined}
      />
      <CurrencySelection
        paymentMethod={paymentMethod}
        selectedCurrencies={selectedCurrencies}
        onToggle={onCurrencyToggle}
      />
    </View>
  )
}
