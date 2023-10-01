import { useConfigStore } from '../../../store/configStore'
import { error } from '../../../utils/log'
import { peachAPI } from '../../../utils/peachAPI'
import { signAndEncrypt } from '../../../utils/pgp'

export const submitRaiseDispute = async (
  contract: Contract | undefined,
  reason: DisputeReason,
  email?: string,
  message?: string,
  // eslint-disable-next-line max-params
): Promise<[boolean, APIError | null]> => {
  if (!contract || !contract.symmetricKey) return [false, null]
  const { encrypted: symmetricKeyEncrypted } = await signAndEncrypt(
    contract.symmetricKey,
    useConfigStore.getState().peachPGPPublicKey,
  )
  const { result, error: err } = await peachAPI.private.contract.raiseDispute({
    contractId: contract.id,
    email,
    reason,
    message,
    symmetricKeyEncrypted,
  })
  if (result) {
    return [true, null]
  }
  if (err) {
    error('Error', err)
    return [false, err]
  }
  return [false, null]
}
