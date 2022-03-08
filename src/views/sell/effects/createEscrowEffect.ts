import { EffectCallback } from 'react'
import { error, info } from '../../../utils/log'
import { createEscrow } from '../../../utils/peachAPI'
import { getPublicKeyForEscrow } from '../../../utils/wallet'

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
    if (!offer.id || offer.escrow) return

    info('Creating escrow for', offer.id)

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