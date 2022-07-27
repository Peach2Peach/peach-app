import { postTx } from '../../utils/peachAPI'
import { info } from '../log'
import { checkRefundPSBT } from './checkRefundPSBT'

export const checkAndRefund = async (
  psbtBase64: string,
  offer: SellOffer
): Promise<{
    tx?: string,
    txId?: string|null,
    err?: string|null,
  }> => {
  const { tx, err } = await checkRefundPSBT(psbtBase64, offer)

  if (!tx || err) return { err }

  const [result, postTXError] = await postTx({
    tx
  })
  info('refundEscrow: ', JSON.stringify(result))

  return {
    tx,
    txId: result?.txId,
    err: postTXError?.error,
  }
}