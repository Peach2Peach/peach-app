import * as bitcoin from 'bitcoinjs-lib'
import { getEscrowWallet, getFinalScript, getNetwork } from '../../utils/wallet'
import { txIdPartOfPSBT } from './txIdPartOfPSBT'


export const checkRefundPSBT = async (
  psbtBase64: string,
  offer: SellOffer
): Promise<{
    tx?: string,
    txId?: string|null,
    err?: string|null,
  }> => {
  if (!offer.id || !psbtBase64) return { err: 'NOT_FOUND' }
  const psbt = bitcoin.Psbt.fromBase64(psbtBase64, { network: getNetwork() })

  if (!psbt || !offer || !offer.funding?.txIds) return { err: 'NOT_FOUND' }

  // Don't trust the response, verify
  const txIds = offer.funding.txIds
  if (!txIds.every(txId => txIdPartOfPSBT(txId, psbt))) {
    return { err: 'INVALID_INPUT' }
  }

  // refunds should only have one output and this is the expected returnAddress
  if (psbt.txOutputs.length > 1) return { err: 'INVALID_OUTPUT' }
  if (psbt.txOutputs[0].address !== offer.returnAddress) {
    return { err: 'RETURN_ADDRESS_MISMATCH' }
  }

  // Sign psbt
  psbt.txInputs.forEach((input, i) =>
    psbt
      .signInput(i, getEscrowWallet(offer.id!))
      .finalizeInput(i, getFinalScript)
  )

  const transaction = psbt.extractTransaction()

  return {
    tx: transaction.toHex(),
    txId: transaction.getId(),
  }
}