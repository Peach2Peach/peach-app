import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { getErrorsInField } from '../../../../../utils/validation'
import { TabbedNavigationItem } from '../../../../navigation/TabbedNavigation'
import { toggleCurrency } from '../../paymentForms/utils'
import { usePaymentDataStore } from '../../../../../store/usePaymentDataStore'

const referenceRules = { required: false }
// eslint-disable-next-line max-lines-per-function, max-statements
export const useTemplate2Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const getPaymentDataByLabel = usePaymentDataStore((state) => state.getPaymentDataByLabel)

  const { currencies, type: paymentMethod } = data
  const tabs: TabbedNavigationItem[] = [
    { id: 'wallet', display: i18n('form.wallet') },
    { id: 'email', display: i18n('form.email') },
  ]
  const [label, setLabel] = useState(data?.label || '')
  const [email, setEmail] = useState(data?.email || '')
  const [wallet, setWallet] = useState(data?.wallet || '')
  const [reference, setReference, referenceIsValid, referenceError] = useValidatedState(
    data?.reference || '',
    referenceRules,
  )
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const [currentTab, setCurrentTab] = useState(tabs[0])

  const anyFieldSet = !!email || !!wallet

  const labelRules = useMemo(
    () => ({
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)?.id !== data.id,
      required: true,
    }),
    [data.id, getPaymentDataByLabel, label],
  )
  const emailRules = useMemo(() => ({ email: true, required: !wallet }), [wallet])
  const walletRules = useMemo(() => ({ advcashWallet: true, required: !email }), [email])

  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])
  const emailErrors = useMemo(() => getErrorsInField(email, emailRules), [email, emailRules])
  const walletErrors = useMemo(() => getErrorsInField(wallet, walletRules), [wallet, walletRules])
  const [displayErrors, setDisplayErrors] = useState(false)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      wallet,
      email,
      reference,
      currencies: selectedCurrencies,
    }),
    [data?.id, email, label, paymentMethod, reference, selectedCurrencies, wallet],
  )

  const isFormValid = useCallback(() => {
    setDisplayErrors(true)
    return [...labelErrors, ...emailErrors, ...walletErrors].length === 0 && referenceIsValid
  }, [emailErrors, labelErrors, walletErrors, referenceIsValid])

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
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
    },
    walletInputProps: {
      onChange: setWallet,
      value: wallet,
      errorMessage: displayErrors ? walletErrors : undefined,
      required: !anyFieldSet,
    },
    emailInputProps: {
      onChange: setEmail,
      value: email,
      errorMessage: displayErrors ? emailErrors : undefined,
      required: !anyFieldSet,
    },
    referenceInputProps: {
      onChange: setReference,
      value: reference,
      errorMessage: displayErrors ? referenceError : undefined,
      onSubmit: save,
    },
    currencySelectionProps: {
      paymentMethod,
      selectedCurrencies,
      onToggle: onCurrencyToggle,
    },
    shouldShowWalletInput: currentTab.id === 'wallet',
    shouldShowEmailInput: currentTab.id === 'email',
  }
}
