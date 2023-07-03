import { useMemo, useState } from 'react'
import { getErrorsInField } from '../../../../../utils/validation'

export const useReceiveAddressInput = (paymentData: Partial<PaymentData>) => {
  const [receiveAddress, setReceiveAddress] = useState(paymentData?.receiveAddress || '')
  const [displayErrors, setDisplayErrors] = useState(false)

  const receiveAddressRules = useMemo(
    () => ({
      required: true,
      // todo: nope
      bitcoinAddress: true,
    }),
    [],
  )

  const receiveAddressErrors = useMemo(
    () => getErrorsInField(receiveAddress, receiveAddressRules),
    [receiveAddress, receiveAddressRules],
  )

  return {
    receiveAddressInputProps: {
      value: receiveAddress,
      onChange: setReceiveAddress,
      errorMessage: displayErrors ? receiveAddressErrors : undefined,
    },
    receiveAddress,
    setDisplayErrors,
    receiveAddressErrors,
  }
}
