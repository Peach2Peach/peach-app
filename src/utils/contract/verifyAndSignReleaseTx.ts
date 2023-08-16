import { BIP32Interface } from 'bip32'
import { Psbt } from 'bitcoinjs-lib'
import { parseError } from '../result'
import { getNetwork } from '../wallet'
import { signBatchReleaseTransaction } from './signBatchReleaseTransaction'
import { signReleaseTransaction } from './signReleaseTransaction'

export const verifyAndSignReleaseTx = (contract: Contract, sellOffer: SellOffer, wallet: BIP32Interface) => {
  const sellOfferId = sellOffer.oldOfferId || sellOffer.id

  if (!sellOfferId || !sellOffer?.funding) return { errorMsg: 'SELL_OFFER_NOT_FOUND' }

  try {
    const releaseTransaction = signReleaseTransaction({
      psbt: Psbt.fromBase64(contract.releasePsbt, {
        network: getNetwork(),
      }),
      contract,
      sellOffer,
      wallet,
    })
    const batchReleasePsbt = contract.batchReleasePsbt
      ? signBatchReleaseTransaction({
        psbt: Psbt.fromBase64(contract.batchReleasePsbt, {
          network: getNetwork(),
        }),
        contract,
        sellOffer,
        wallet,
      })
      : undefined

    return { releaseTransaction, batchReleasePsbt }
  } catch (e) {
    return { errorMsg: parseError(e) }
  }
}
