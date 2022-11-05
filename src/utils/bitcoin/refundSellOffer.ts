import { Psbt } from 'bitcoinjs-lib'
import { postTx } from '../peachAPI'
import { info } from '../log'
import { signPSBT } from './signPSBT'

/**
 * @description Method to refund sell offer
 * @param psbt psbt for refunding
 * @param offer sell offer to refund
 * @returns refunding status
 */
export const refundSellOffer = async (psbt: Psbt, offer: SellOffer): Promise<RefundingStatus> => {
  const signedPSBT = signPSBT(psbt, offer)
  const tx = signedPSBT.extractTransaction().toHex()
  const [result, postTXError] = await postTx({
    tx,
  })
  info('refundEscrow: ', JSON.stringify(result))

  return {
    tx,
    txId: result?.txId,
    err: postTXError?.error,
  }
}
