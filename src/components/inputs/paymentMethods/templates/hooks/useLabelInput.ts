import { useMemo, useState } from 'react'
import { getErrorsInField } from '../../../../../utils/validation'
import { usePaymentDataStore } from '../../../../../store/usePaymentDataStore'

export const useLabelInput = (paymentData: Partial<PaymentData>) => {
  const [label, setLabel] = useState(paymentData?.label || '')
  const [displayErrors, setDisplayErrors] = useState(false)
  const getPaymentDataByLabel = usePaymentDataStore((state) => state.getPaymentDataByLabel)

  const labelRules = useMemo(
    () => ({
      required: true,
      duplicate: getPaymentDataByLabel(label) && getPaymentDataByLabel(label)?.id !== paymentData.id,
    }),
    [getPaymentDataByLabel, label, paymentData.id],
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
