import { useState } from 'react'

export const usePaymentMethodFormSetup = (onSubmit: (data: PaymentData) => void) => {
  const [stepValid, setStepValid] = useState(false)

  const submit = (newPaymentData: PaymentData) => {
    if (!stepValid) return
    onSubmit(newPaymentData)
  }

  return {
    submit,
    stepValid,
    setStepValid,
  }
}
