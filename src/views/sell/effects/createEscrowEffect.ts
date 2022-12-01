import { EffectCallback } from 'react'
import { error, info } from '../../../utils/log'
import { createEscrow } from '../../../utils/peachAPI'
import { getPublicKeyForEscrow, getWallet } from '../../../utils/wallet'

type CreateEscrowIfNewProps = {
  sellOffer: SellOffer
  onSuccess: (result: CreateEscrowResponse) => void
  onError: (err: APIError) => void
}
export default ({ sellOffer, onSuccess, onError }: CreateEscrowIfNewProps): EffectCallback =>
  () => {
    ;(async () => {
      if (!sellOffer.id || sellOffer.escrow) return

      info('Creating escrow for', sellOffer.id)

      const publicKey = getPublicKeyForEscrow(getWallet(), sellOffer.id)
      const [result, err] = await createEscrow({
        offerId: sellOffer.id,
        publicKey,
      })

      if (result) {
        onSuccess(result)
      } else if (err) {
        error('Error', err)
        onError(err)
      }
    })()
  }
