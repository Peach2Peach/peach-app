import { useCallback, useEffect, useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'
import { toggleCurrency } from '../../paymentForms/utils'
import { hasMultipleAvailableCurrencies } from '../utils/hasMultipleAvailableCurrencies'
import { useBeneficiaryInput } from './useBeneficiaryInput'
import { useLabelInput } from './useLabelInput'

const rules = { required: true }
const usePostePayNumberInput = (data: FormProps['data']) => {
  const [postePayNumber, setPostePayNumber, postePayNumberIsValid, postePayNumberErrors] = useValidatedState(
    data?.postePayNumber || '',
    rules,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  const postePayNumberInputProps = {
    value: postePayNumber,
    onChange: setPostePayNumber,
    errorMessage: displayErrors ? postePayNumberErrors : undefined,
  }

  return {
    postePayNumberInputProps,
    postePayNumber,
    postePayNumberIsValid,
    setDisplayErrors,
  }
}

export const useTemplate20Setup = ({ data, onSubmit, setStepValid, setFormData }: FormProps) => {
  const { currencies, type: paymentMethod } = data
  const { labelInputProps, labelErrors, setDisplayErrors: setDisplayLabelErrors, label } = useLabelInput(data)
  const {
    beneficiaryInputProps,
    beneficiary,
    beneficiaryIsValid,
    setDisplayErrors: setDisplayBeneficiaryErrors,
  } = useBeneficiaryInput(data)
  const {
    postePayNumberInputProps,
    postePayNumber,
    postePayNumberIsValid,
    setDisplayErrors: setDisplayPostePayNumberErrors,
  } = usePostePayNumberInput(data)
  const [selectedCurrencies, setSelectedCurrencies] = useState(data?.currencies || currencies)

  const buildPaymentData = useCallback(
    () => ({
      id: data?.id || `${paymentMethod}-${Date.now()}`,
      label,
      type: paymentMethod,
      beneficiary,
      postePayNumber,
      currencies: selectedCurrencies,
    }),
    [data?.id, paymentMethod, label, beneficiary, postePayNumber, selectedCurrencies],
  )

  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies(toggleCurrency(currency))
  }

  const isFormValid = useCallback(() => {
    setDisplayLabelErrors(true)
    setDisplayBeneficiaryErrors(true)
    setDisplayPostePayNumberErrors(true)
    return labelErrors.length === 0 && beneficiaryIsValid && postePayNumberIsValid
  }, [
    beneficiaryIsValid,
    labelErrors.length,
    postePayNumberIsValid,
    setDisplayBeneficiaryErrors,
    setDisplayLabelErrors,
    setDisplayPostePayNumberErrors,
  ])

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
    beneficiaryInputProps,
    postePayNumberInputProps: { ...postePayNumberInputProps, onSubmit: save },
    currencySelectionProps: {
      paymentMethod,
      onToggle: onCurrencyToggle,
      selectedCurrencies,
    },
    shouldShowCurrencySelection: hasMultipleAvailableCurrencies(paymentMethod),
  }
}
