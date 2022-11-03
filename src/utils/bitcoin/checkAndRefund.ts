import { postTx } from '../../utils/peachAPI'
import { info } from '../log'
import { checkRefundPSBT } from './checkRefundPSBT'
import { signPSBT } from './signPSBT'

export const checkAndRefund = async (
  psbtBase64: string,
  offer: SellOffer,
): Promise<{
  tx?: string
  txId?: string | null
  err?: string | null
}> => {
  const { isValid, psbt, err } = await checkRefundPSBT(psbtBase64, offer)

  if (!isValid || !psbt || err) return { err }

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
