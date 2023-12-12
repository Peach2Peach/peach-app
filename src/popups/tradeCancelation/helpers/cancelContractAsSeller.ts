import { peachAPI } from '../../../utils/peachAPI'
import { patchSellOfferWithRefundTx } from './patchSellOfferWithRefundTx'

export const cancelContractAsSeller = async (contract: Contract) => {
  const { result, error: err } = await peachAPI.private.contract.cancelContract({ contractId: contract.id })

  if (!result?.success || err) return { result: { sellOffer: undefined }, error: err?.error }

  if (!result.psbt) return { result: { sellOffer: undefined } }

  const { result: patchOfferResult, error } = await patchSellOfferWithRefundTx(contract, result.psbt)
  if (error || !patchOfferResult) {
    return { result: { sellOffer: patchOfferResult.sellOffer }, error }
  }

  return { result: { sellOffer: patchOfferResult.sellOffer } }
}
