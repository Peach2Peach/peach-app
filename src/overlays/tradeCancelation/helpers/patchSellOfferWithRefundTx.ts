import { checkRefundPSBT, signPSBT } from '../../../utils/bitcoin'
import { getSellOfferFromContract } from '../../../utils/contract'
import { patchOffer } from '../../../utils/peachAPI'
import { getResult } from '../../../utils/result'

export const patchSellOfferWithRefundTx = async (contract: Contract, refundPSBT: string) => {
  const sellOffer = getSellOfferFromContract(contract)
  const { isValid, psbt, err: checkRefundPSBTError } = checkRefundPSBT(refundPSBT, sellOffer)

  if (checkRefundPSBTError) return getResult({ sellOffer }, checkRefundPSBTError)
  if (!isValid || !psbt) return getResult({ sellOffer }, new Error('UNKNOWN_ERROR'))

  const signedPSBT = signPSBT(psbt, sellOffer, false)
  const [patchOfferResult, patchOfferError] = await patchOffer({
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
