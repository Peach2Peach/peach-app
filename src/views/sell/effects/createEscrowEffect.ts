import { EffectCallback } from 'react'
import { error, info } from '../../../utils/logUtils'
import { createEscrow } from '../../../utils/peachAPI'
import { getPublicKeyForEscrow } from '../../../utils/walletUtils'

type CreateEscrowIfNewProps = {
  offer: SellOffer,
  onSuccess: (result: CreateEscrowResponse) => void,
  onError: (error: APIError) => void,
}
export default ({
  offer,
  onSuccess,
  onError
}: CreateEscrowIfNewProps): EffectCallback => () => {
  (async () => {
    info('Creating escrow for', offer.id)

    if (!offer.id || offer.escrow) return

    const publicKey = getPublicKeyForEscrow(offer.id)
    const [result, err] = await createEscrow({
      offerId: offer.id,
      publicKey
    })

    if (result) {
      onSuccess(result)
    } else if (err) {
      error('Error', err)
      onError(err)
    }
  })()
}