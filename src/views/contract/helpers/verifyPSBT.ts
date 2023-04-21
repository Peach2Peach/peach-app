import { Psbt } from 'bitcoinjs-lib'
import { configStore } from '../../../store/configStore'
import { txIdPartOfPSBT } from '../../../utils/bitcoin'
import { releaseTransactionHasValidOutputs } from './releaseTransactionHasValidOutputs'

export const verifyPSBT = (psbt: Psbt, sellOffer: SellOffer, contract: Contract): string | null => {
  if (!sellOffer || !sellOffer.funding?.txIds) return 'MISSING_DATA'

  const txIds = sellOffer.funding.txIds
  if (!txIds.every((txId) => txIdPartOfPSBT(txId, psbt))) {
    return 'INVALID_INPUT'
  }

  if (psbt.txOutputs.every((output) => output.address !== contract.releaseAddress)) {
    return 'RETURN_ADDRESS_MISMATCH'
  }

  const { peachFee } = configStore.getState()
  if (!releaseTransactionHasValidOutputs(psbt, contract, peachFee)) return 'INVALID_OUTPUT'

  return ''
}
