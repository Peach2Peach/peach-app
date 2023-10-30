import { Psbt } from 'bitcoinjs-lib'
import { useConfigStore } from '../../../store/configStore'
import { txIdPartOfPSBT } from '../../../utils/bitcoin'
import { releaseTransactionHasValidOutputs } from './releaseTransactionHasValidOutputs'

export const verifyReleasePSBT = (psbt: Psbt, sellOffer?: SellOffer, contract?: Contract) => {
  if (!sellOffer || sellOffer.funding.txIds.length === 0 || !contract) return 'MISSING_DATA'

  const txIds = sellOffer.funding.txIds
  if (!txIds.every((txId) => txIdPartOfPSBT(txId, psbt))) {
    return 'INVALID_INPUT'
  }

  if (psbt.txOutputs.every((output) => output.address !== contract.releaseAddress)) {
    return 'RETURN_ADDRESS_MISMATCH'
  }

  const { peachFee } = useConfigStore.getState()
  if (!releaseTransactionHasValidOutputs(psbt, contract, peachFee)) return 'INVALID_OUTPUT'

  return ''
}
