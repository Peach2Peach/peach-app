import { useCallback, useEffect, useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import i18n from '../../../../../utils/i18n'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { toggleCurrency } from '../../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { useLabelInput } from './useLabelInput'
import { useReferenceInput } from './useReferenceInput'

const chipperTagRules = { required: true, userName: true }

export const useTemplate18Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const [chipperTag, setChipperTag, chipperTagIsValid, chipperTagErrors] = useValidatedState(
    data?.chipperTag || '',
    chipperTagRules,
  )
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
      chipperTag,
      reference,
      currencies: selectedCurrencies,
    }),
    [data?.id, paymentMethod, label, chipperTag, reference, selectedCurrencies],
  )

  const onCurrencyToggle = (currency: Currency) => setSelectedCurrencies(toggleCurrency(currency))

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayErrors(true)
    setDisplayReferenceErrors(true)
    return labelErrors.length === 0 && chipperTagIsValid && referenceIsValid
  }, [chipperTagIsValid, labelErrors.length, referenceIsValid, setDisplayLabelErrors, setDisplayReferenceErrors])

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
    chipperTagInputProps: {
      value: chipperTag,
      required: true,
      onChange: setChipperTag,
      onSubmit: save,
      label: i18n('form.chippertag'),
      placeholder: i18n('form.chippertag.placeholder'),
      errorMessage: displayErrors ? chipperTagErrors : undefined,
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
