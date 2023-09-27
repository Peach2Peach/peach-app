import { isPaymentTimeExpired } from '../../../utils/contract'
import { peachAPI } from '../../../utils/peachAPI'
import { getResult } from '../../../utils/result'
import { Result } from '../../../utils/result/types'
import { patchSellOfferWithRefundTx } from './patchSellOfferWithRefundTx'

type UpdateResult = {
  contract: Contract
  sellOffer?: SellOffer
}
const getContractUpdatedBasedOnExpiry = (contract: Contract) =>
  isPaymentTimeExpired(contract)
    ? {
      ...contract,
      cancelConfirmationDismissed: false,
      canceled: true,
    }
    : contract

export const cancelContractAsSeller = async (contract: Contract): Promise<Result<UpdateResult, string>> => {
  const { result, error: err } = await peachAPI.private.contract.cancelContract({ contractId: contract.id })

  if (!result?.success || err) return getResult({ contract, sellOffer: undefined }, err?.error)

  const updatedContract = getContractUpdatedBasedOnExpiry(contract)
  if (!result.psbt) return getResult({
    contract: updatedContract,
    sellOffer: undefined,
  })

  const patchOfferResult = await patchSellOfferWithRefundTx(contract, result.psbt)
  if (patchOfferResult.isError() || !patchOfferResult.isOk()) return getResult(
    {
      contract: updatedContract,
      sellOffer: patchOfferResult.getValue()?.sellOffer,
    },
    patchOfferResult.getError(),
  )

  return getResult({
    contract: updatedContract,
    sellOffer: patchOfferResult.getValue().sellOffer,
  })
}
