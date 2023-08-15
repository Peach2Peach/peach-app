import { BIP32Interface } from 'bip32'
import { Psbt } from 'bitcoinjs-lib'
import { isPSBTForBatch, verifyPSBT } from '../../views/contract/helpers'
import { signAndFinalizePSBT } from '../bitcoin'
import { parseError } from '../result'
import { getNetwork, signPSBT } from '../wallet'

const signReleaseTransaction = (psbt: Psbt, contract: Contract, sellOffer: SellOffer, wallet: BIP32Interface) => {
  // Don't trust the response, verify
  const errorMsg = verifyPSBT(psbt, sellOffer, contract)

  if (errorMsg) throw Error(errorMsg)

  signAndFinalizePSBT(psbt, wallet)
  return psbt.extractTransaction().toHex()
}
const signBatchReleaseTransaction = (psbt: Psbt, contract: Contract, sellOffer: SellOffer, wallet: BIP32Interface) => {
  // Don't trust the response, verify
  const errorMsg = verifyPSBT(psbt, sellOffer, contract)

  if (errorMsg) throw Error(errorMsg)
  if (!isPSBTForBatch(psbt)) throw Error('Transaction is not for batching')

  signPSBT(psbt, wallet)
  return psbt.toBase64()
}

export const verifyAndSignReleaseTx = (contract: Contract, sellOffer: SellOffer, wallet: BIP32Interface) => {
  const sellOfferId = sellOffer.oldOfferId || sellOffer.id

  if (!sellOfferId || !sellOffer?.funding) return { errorMsg: 'SELL_OFFER_NOT_FOUND' }

  try {
    const releaseTransaction = signReleaseTransaction(
      Psbt.fromBase64(contract.releasePsbt, {
        network: getNetwork(),
      }),
      contract,
      sellOffer,
      wallet,
    )
    const batchReleasePsbt = contract.batchReleasePsbt
      ? signBatchReleaseTransaction(
        Psbt.fromBase64(contract.batchReleasePsbt, {
          network: getNetwork(),
        }),
        contract,
        sellOffer,
        wallet,
      )
      : undefined

    return { releaseTransaction, batchReleasePsbt }
  } catch (e) {
    return { errorMsg: parseError(e) }
  }
}
