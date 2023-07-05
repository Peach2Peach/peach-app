import { useMemo, useState } from 'react'
import { getPaymentDataByLabel } from '../../../../../utils/account'
import { getErrorsInField } from '../../../../../utils/validation'

export const useLabelInput = (paymentData: Partial<PaymentData>) => {
  const [label, setLabel] = useState(paymentData?.label || '')
  const [displayErrors, setDisplayErrors] = useState(false)

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)?.id !== paymentData.id,
    }),
    [paymentData.id, label],
  )
  const labelErrors = useMemo(() => getErrorsInField(label, labelRules), [label, labelRules])

  return {
    labelInputProps: {
      value: label,
      onChange: setLabel,
      errorMessage: displayErrors ? labelErrors : undefined,
    },
    label,
    setDisplayErrors,
    labelErrors,
  }
}
