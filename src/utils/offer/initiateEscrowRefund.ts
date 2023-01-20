import { saveOffer } from '.'
import { checkAndRefund } from '../bitcoin'
import { error, info } from '../log'

export const initiateEscrowRefund = async (
  sellOffer: SellOffer,
  cancelationData: CancelOfferResponse,
): Promise<[string | null, string | null]> => {
  info('Get refunding info', cancelationData)
  const { tx, txId, err } = await checkAndRefund(cancelationData.psbt, sellOffer)

  if (tx && txId) {
    saveOffer({
      ...sellOffer,
      tx,
      txId,
      refunded: true,
    })
    return [txId, null]
  } else if (err) {
    error('Error', err)
    return [null, err]
  }
  return [null, 'GENERAL_ERROR']
}
