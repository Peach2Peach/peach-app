import { useState } from 'react'
import { useValidatedState } from '../../../../../hooks'
import { FormProps } from '../../../../../views/addPaymentMethod/PaymentMethodForm'

const beneficiaryRules = { required: true }
export const useBeneficiaryInput = (data: FormProps['data']) => {
  const [beneficiary, setBeneficiary, beneficiaryIsValid, beneficiaryErrors] = useValidatedState(
    data?.beneficiary || '',
    beneficiaryRules,
  )
  const [displayErrors, setDisplayErrors] = useState(false)

  const beneficiaryInputProps = {
    value: beneficiary,
    onChange: setBeneficiary,
    errorMessage: displayErrors ? beneficiaryErrors : undefined,
  }

  return {
    beneficiaryInputProps,
    beneficiary,
    beneficiaryIsValid,
    setDisplayErrors,
  }
}
