import { checkRefundPSBT } from '../../../utils/bitcoin'
import { getSellOfferFromContract } from '../../../utils/contract'
import { peachAPI } from '../../../utils/peachAPI'
import { getResult } from '../../../utils/result'
import { Result } from '../../../utils/result/types'
import { getEscrowWalletForOffer, signPSBT } from '../../../utils/wallet'

type UpdateResult = {
  sellOffer: SellOffer
}

export const patchSellOfferWithRefundTx = async (
  contract: Contract,
  refundPSBT: string,
): Promise<Result<UpdateResult, string>> => {
  const sellOffer = getSellOfferFromContract(contract)
  const { isValid, psbt, err: checkRefundPSBTError } = checkRefundPSBT(refundPSBT, sellOffer)

  if (checkRefundPSBTError) return getResult({ sellOffer }, checkRefundPSBTError)
  if (!isValid || !psbt) return getResult({ sellOffer }, 'UNKNOWN_ERROR')

  const signedPSBT = signPSBT(psbt, getEscrowWalletForOffer(sellOffer))
  const { result: patchOfferResult, error: patchOfferError } = await peachAPI.private.offer.patchOffer({
    offerId: sellOffer.id,
    refundTx: signedPSBT.toBase64(),
  })
  if (!patchOfferResult || patchOfferError) {
    return getResult({ sellOffer }, patchOfferError?.error || 'UNKNOWN_ERROR')
  }

  return getResult({
    sellOffer: {
      ...sellOffer,
      refundTx: psbt.toBase64(),
    },
  })
}
