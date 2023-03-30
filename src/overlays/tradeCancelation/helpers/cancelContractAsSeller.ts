import { isPaymentTimeExpired } from '../../../utils/contract'
import { cancelContract } from '../../../utils/peachAPI'
import { getResult } from '../../../utils/result'
import { patchSellOfferWithRefundTx } from './patchSellOfferWithRefundTx'

const getContractUpdatedBasedOnExpiry = (contract: Contract) =>
  isPaymentTimeExpired(contract)
    ? {
      ...contract,
      cancelConfirmationDismissed: false,
      canceled: true,
    }
    : contract

export const cancelContractAsSeller = async (contract: Contract) => {
  const [result, err] = await cancelContract({ contractId: contract.id })

  if (!result?.success || err) return getResult({ contract, sellOffer: undefined }, err)

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
