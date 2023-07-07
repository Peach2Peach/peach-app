import { useCallback, useEffect, useState } from 'react'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { toggleCurrency } from '../../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { useLabelInput } from './useLabelInput'

const emailRules = {
  required: true,
  email: true,
}
const referenceRules = { required: false }
// eslint-disable-next-line max-lines-per-function
export const useTemplate4Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [email, setEmail, emailIsValid, emailErrors] = useValidatedState(data?.email || '', emailRules)
  const [displayErrors, setDisplayErrors] = useState(false)
  const [beneficiary, setBeneficiary] = useState(data?.beneficiary || '')
  const [reference, setReference, , referenceError] = useValidatedState(data?.reference || '', referenceRules)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod !== 'giftCard.amazon' ? paymentMethod : (`${paymentMethod}.${data?.country}` as PaymentMethod),
      email,
      beneficiary,
      reference,
      currencies: selectedCurrencies,
      country: data?.country,
    }),
    [data?.country, data?.id, beneficiary, email, label, paymentMethod, reference, selectedCurrencies],
  )

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    return emailIsValid && labelErrors.length === 0
  }, [emailIsValid, labelErrors.length, setDisplayLabelErrors])

  const save = () => {
    if (!isFormValid()) return

    onSubmit(buildPaymentData())
  }

  useEffect(() => {
    setStepValid(isFormValid())
    setFormData(buildPaymentData())
  }, [isFormValid, setStepValid, buildPaymentData, setFormData])

  return {
    labelInputProps,
    emailInputProps: {
      onChange: setEmail,
      value: email,
      errorMessage: displayErrors ? emailErrors : undefined,
      label: i18n('form.emailLong'),
      required: true,
    },
    beneficiaryInputProps: {
      onChange: setBeneficiary,
      value: beneficiary,
      required: false,
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
    shouldShowCurrencySelection: paymentMethod !== 'giftCard.amazon' && hasMultipleAvailableCurrencies(paymentMethod),
  }
}
