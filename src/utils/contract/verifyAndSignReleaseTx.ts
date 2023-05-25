import { BIP32Interface } from 'bip32'
import { Psbt } from 'bitcoinjs-lib'
import { verifyPSBT } from '../../views/contract/helpers'
import { signAndFinalizePSBT } from '../bitcoin'
import { getNetwork } from '../wallet'

export const verifyAndSignReleaseTx = (
  contract: Contract,
  sellOffer: SellOffer,
  wallet: BIP32Interface,
): [string | null, string | null] => {
  const sellOfferId = sellOffer.oldOfferId || sellOffer.id

  if (!sellOfferId || !sellOffer?.funding) return [null, 'SELL_OFFER_NOT_FOUND']

  const psbt = Psbt.fromBase64(contract.releaseTransaction, { network: getNetwork() })

  // Don't trust the response, verify
  const errorMsg = verifyPSBT(psbt, sellOffer, contract)

  if (errorMsg) return [null, errorMsg]

  signAndFinalizePSBT(psbt, wallet)

  const tx = psbt.extractTransaction().toHex()

  return [tx, null]
}
