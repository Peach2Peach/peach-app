import { useState } from 'react'
import { useValidatedState } from '../../../../../hooks'

const referenceRules = { required: false, isValidPaymentReference: true }

export const useReferenceInput = (data: Partial<PaymentData>) => {
  const [reference, setReference, referenceIsValid, referenceErrors] = useValidatedState(
    data?.reference || '',
    referenceRules,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  return {
    referenceInputProps: {
      value: reference,
      onChange: setReference,
      errorMessage: displayErrors ? referenceErrors : undefined,
    },
    reference,
    referenceIsValid,
    setDisplayErrors,
  }
}
