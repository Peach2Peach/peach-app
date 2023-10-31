import { cancelContract } from '../../../utils/peachAPI'
import { getResult } from '../../../utils/result'
import { Result } from '../../../utils/result/types'
import { patchSellOfferWithRefundTx } from './patchSellOfferWithRefundTx'

type UpdateResult = {
  sellOffer?: SellOffer
}

export const cancelContractAsSeller = async (contract: Contract): Promise<Result<UpdateResult, string>> => {
  const [result, err] = await cancelContract({ contractId: contract.id })

  if (!result?.success || err) return getResult({ sellOffer: undefined }, err?.error)

  if (!result.psbt) return getResult({ sellOffer: undefined })

  const patchOfferResult = await patchSellOfferWithRefundTx(contract, result.psbt)
  if (patchOfferResult.isError() || !patchOfferResult.isOk()) {
    return getResult({ sellOffer: patchOfferResult.getValue()?.sellOffer }, patchOfferResult.getError())
  }

  return getResult({ sellOffer: patchOfferResult.getValue().sellOffer })
}
