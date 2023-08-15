import { useCallback, useEffect, useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { toggleCurrency } from '../../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { useLabelInput } from './useLabelInput'

const eversendUserNameRules = { required: true, userName: true }

export const useTemplate19Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [eversendUserName, setEversendUserName, eversendUserNameIsValid, eversendUserNameErrors] = useValidatedState(
    data?.eversendUserName || '',
    eversendUserNameRules,
  )
  const [displayErrors, setDisplayErrors] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      eversendUserName,
      currencies: selectedCurrencies,
    }),
    [data?.id, paymentMethod, label, eversendUserName, selectedCurrencies],
  )

  const onCurrencyToggle = (currency: Currency) => setSelectedCurrencies(toggleCurrency(currency))

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    return labelErrors.length === 0 && eversendUserNameIsValid
  }, [eversendUserNameIsValid, labelErrors.length, setDisplayLabelErrors])

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [buildPaymentData, isFormValid, setFormData, setStepValid])

  return {
    labelInputProps,
    eversendUserNameInputProps: {
      value: eversendUserName,
      required: true,
      onChange: setEversendUserName,
      onSubmit: save,
      label: i18n('form.userName'),
      placeholder: i18n('form.userName.placeholder'),
      errorMessage: displayErrors ? eversendUserNameErrors : undefined,
    },
    currencySelectionProps: {
      paymentMethod,
      onToggle: onCurrencyToggle,
      selectedCurrencies,
    },
    shouldShowCurrencySelection: hasMultipleAvailableCurrencies(paymentMethod),
  }
}
