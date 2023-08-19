import { useState } from 'react'
import { useValidatedState } from '../../../../../hooks'

const phoneRules = { required: true, phone: true, isPhoneAllowed: true }
export const usePhoneInput = (data: Partial<PaymentData>) => {
  const [phone, setPhone, phoneIsValid, phoneErrors] = useValidatedState(data?.phone || '', phoneRules)
  const [displayErrors, setDisplayErrors] = useState(false)

  return {
    phoneInputProps: {
      onChange: setPhone,
      value: phone,
      errorMessage: displayErrors ? phoneErrors : undefined,
    },
    phone,
    phoneIsValid,
    setDisplayErrors,
  }
}
