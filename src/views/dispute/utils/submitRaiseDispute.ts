import { useConfigStore } from '../../../store/configStore/configStore'
import { error } from '../../../utils/log'
import { peachAPI } from '../../../utils/peachAPI'
import { signAndEncrypt } from '../../../utils/pgp/signAndEncrypt'

type Props = {
  contract: Contract | undefined
  symmetricKey: string | undefined
  reason: DisputeReason
  email?: string
  message?: string
}

export const submitRaiseDispute = async ({ contract, symmetricKey, reason, email, message }: Props) => {
  if (!contract || !symmetricKey) return [false, null] as const
  const { encrypted: symmetricKeyEncrypted } = await signAndEncrypt(
    symmetricKey,
    useConfigStore.getState().peachPGPPublicKey,
  )
  const { result, error: err } = await peachAPI.private.contract.raiseDispute({
    contractId: contract.id,
    email,
    reason,
    message,
    symmetricKeyEncrypted,
  })

  if (result) return [true, null] as const
  if (err) {
    error('Error', err)
    return [false, err] as const
  }
  return [false, null] as const
}
