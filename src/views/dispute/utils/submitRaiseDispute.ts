import { useConfigStore } from '../../../store/configStore/configStore'
import { error } from '../../../utils/log'
import { peachAPI } from '../../../utils/peachAPI'
import { signAndEncrypt } from '../../../utils/pgp/signAndEncrypt'

type Props = {
  contract?: Contract
  symmetricKey?: string
  reason: DisputeReason
  email?: string
  message?: string
  paymentData?: PaymentData
}

export const submitRaiseDispute = async ({ contract, symmetricKey, paymentData, reason, email, message }: Props) => {
  if (!contract || !symmetricKey) return [false, null] as const
  const [{ encrypted: symmetricKeyEncrypted }, { encrypted: paymentDataSellerEncrypted }] = await Promise.all([
    signAndEncrypt(symmetricKey, useConfigStore.getState().peachPGPPublicKey),
    paymentData
      ? signAndEncrypt(JSON.stringify(paymentData), useConfigStore.getState().peachPGPPublicKey)
      : { encrypted: undefined },
  ])
  const { result, error: err } = await peachAPI.private.contract.raiseDispute({
    contractId: contract.id,
    email,
    reason,
    message,
    symmetricKeyEncrypted,
    paymentDataSellerEncrypted,
  })

  if (result) return [true, null] as const
  if (err) {
    error('Error', err)
    return [false, err] as const
  }
  return [false, null] as const
}
