import { error, info } from '../../../utils/log'
import { createEscrow as createEscrowRequest } from '../../../utils/peachAPI'
import { getPublicKeyForEscrow, getWallet } from '../../../utils/wallet'

export const createEscrow = async (
  offerId: string,
  onSuccess: (result: CreateEscrowResponse) => void,
  onError: (err: APIError) => void,
) => {
  info('Creating escrow for', offerId)

  const publicKey = getPublicKeyForEscrow(getWallet(), offerId)
  const [result, err] = await createEscrowRequest({
    offerId,
    publicKey,
  })

  if (result) {
    onSuccess(result)
  } else if (err) {
    error('Error', err)
    onError(err)
  }
}
