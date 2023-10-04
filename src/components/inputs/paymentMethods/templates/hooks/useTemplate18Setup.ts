import { useCallback, useEffect, useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { toggleCurrency } from '../../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { useLabelInput } from './useLabelInput'
import { useReferenceInput } from './useReferenceInput'

const userNameRules = { required: true, userName: true }

export const useTemplate18Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [userName, setUserName, userNameIsValid, userNameErrors] = useValidatedState(data?.userName || '', userNameRules)
  const {
    referenceInputProps,
    referenceIsValid,
    setDisplayErrors: setDisplayReferenceErrors,
    reference,
  } = useReferenceInput(data)
  const [displayErrors, setDisplayErrors] = useState(false)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      userName,
      reference,
      currencies: selectedCurrencies,
    }),
    [data?.id, paymentMethod, label, userName, reference, selectedCurrencies],
  )

  const onCurrencyToggle = (currency: Currency) => setSelectedCurrencies(toggleCurrency(currency))

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    setDisplayReferenceErrors(true)
    return labelErrors.length === 0 && userNameIsValid && referenceIsValid
  }, [userNameIsValid, labelErrors.length, referenceIsValid, setDisplayLabelErrors, setDisplayReferenceErrors])

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
    userNameInputProps: {
      value: userName,
      required: true,
      onChange: setUserName,
      onSubmit: save,
      errorMessage: displayErrors ? userNameErrors : undefined,
      label: paymentMethod === 'chippercash' ? i18n('form.chippertag') : i18n('form.userName'),
      placeholder:
        paymentMethod === 'chippercash' ? i18n('form.chippertag.placeholder') : i18n('form.userName.placeholder'),
    },
    referenceInputProps,
    currencySelectionProps: {
      paymentMethod,
      onToggle: onCurrencyToggle,
      selectedCurrencies,
    },
    shouldShowCurrencySelection: hasMultipleAvailableCurrencies(paymentMethod),
  }
}
