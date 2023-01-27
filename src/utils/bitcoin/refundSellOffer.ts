import { Psbt } from 'bitcoinjs-lib'
import { postTx } from '../peachAPI'
import { info } from '../log'
import { signPSBT } from './signPSBT'

export type RefundingStatus = {
  psbt: Psbt
  tx?: string
  txId?: string | null
  err?: string | null
}

export const refundSellOffer = async (psbt: Psbt, offer: SellOffer): Promise<RefundingStatus> => {
  const signedPSBT = signPSBT(psbt, offer)
  const tx = signedPSBT.extractTransaction().toHex()
  const [result, postTXError] = await postTx({
    tx,
  })
  info('refundEscrow: ', JSON.stringify(result))

  return {
    psbt,
    tx,
    txId: result?.txId,
    err: postTXError?.error,
  }
}
