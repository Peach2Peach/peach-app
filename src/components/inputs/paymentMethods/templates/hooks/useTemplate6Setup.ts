import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProps } from '../../paymentForms/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import tw from '../../../../../styles/tailwind'
import { getPaymentDataByLabel } from '../../../../../utils/account'
import i18n from '../../../../../utils/i18n'
import { getErrorsInField } from '../../../../../utils/validation'
import { TabbedNavigationItem } from '../../../../navigation/TabbedNavigation'
import { toggleCurrency } from '../../paymentForms/utils'

const referenceRules = { required: false, isValidPaymentReference: true }
// eslint-disable-next-line max-lines-per-function, max-statements
export const useTemplate6Setup = ({
  data,
  currencies = [],
  onSubmit,
  setStepValid,
  paymentMethod,
  setFormData,
}: FormProps) => {
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
  const [reference, setReference, referenceIsValid, referenceError] = useValidatedState(
    data?.reference || '',
    referenceRules,
  )
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)
  const [displayErrors, setDisplayErrors] = useState(false)

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)!.id !== data.id,
    }),
    [data.id, label],
  )
  const emailRules = useMemo(() => ({ required: !phone && !userName, email: true }), [phone, userName])
  const userNameRules = useMemo(
    () => ({
      userName: paymentMethod === 'wise',
      paypalUserName: paymentMethod === 'paypal',
      revtag: paymentMethod === 'revolut',
      required: !phone && !email,
    }),
    [email, paymentMethod, phone],
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
    () => ({
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

    return [...labelErrors, ...phoneErrors, ...emailErrors, ...userNameErrors].length === 0 && referenceIsValid
  }, [emailErrors, labelErrors, phoneErrors, referenceIsValid, userNameErrors])

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

  return {
    labelInputProps: {
      onChange: setLabel,
      value: label,
      errorMessage: displayErrors ? labelErrors : undefined,
    },
    tabbedNavigationProps: {
      items: tabs,
      selected: currentTab,
      select: setCurrentTab,
      buttonStyle: tw`p-0`,
      tabHasError: displayErrors ? getErrorTabs() : [],
    },
    phoneInputProps: {
      onChange: setPhone,
      value: phone,
      required: !email && !userName,
      errorMessage: displayErrors ? phoneErrors : undefined,
    },
    emailInputProps: {
      onChange: setEmail,
      value: email,
      label: i18n('form.emailLong'),
      required: !phone && !userName,
      errorMessage: displayErrors ? emailErrors : undefined,
    },
    userNameInputProps: {
      maxLength: paymentMethod === 'paypal' ? 21 : 17,
      onChange: setUserName,
      value: userName,
      label: paymentMethod === 'paypal' ? i18n('form.userName') : i18n('form.revtag'),
      placeholder: paymentMethod === 'paypal' ? i18n('form.userName.placeholder') : i18n('form.revtag.placeholder'),
      autoCorrect: false,
      required: !phone && !email,
      errorMessage: displayErrors ? userNameErrors : undefined,
    },
    referenceInputProps: {
      onChange: setReference,
      onSubmit: save,
      value: reference,
      errorMessage: displayErrors ? referenceError : undefined,
    },
    currencySelectionProps: {
      paymentMethod,
      selectedCurrencies,
      onToggle: onCurrencyToggle,
    },
    shouldShowPhoneInput: currentTab.id === 'phone',
    shouldShowEmailInput: currentTab.id === 'email',
    shouldShowUserNameInput: currentTab.id === 'userName' || currentTab.id === 'revtag',
  }
}
