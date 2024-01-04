import { checkRefundPSBT } from '../../../utils/bitcoin/checkRefundPSBT'
import { getSellOfferFromContract } from '../../../utils/contract/getSellOfferFromContract'
import { peachAPI } from '../../../utils/peachAPI'
import { getEscrowWalletForOffer } from '../../../utils/wallet/getEscrowWalletForOffer'
import { signPSBT } from '../../../utils/wallet/signPSBT'

export const patchSellOfferWithRefundTx = async (contract: Contract, refundPSBT: string) => {
  const sellOffer = getSellOfferFromContract(contract)
  const { isValid, psbt, err: checkRefundPSBTError } = checkRefundPSBT(refundPSBT, sellOffer)

  if (checkRefundPSBTError) return { result: { sellOffer }, error: checkRefundPSBTError }
  if (!isValid || !psbt) return { result: { sellOffer }, error: 'UNKNOWN_ERROR' }

  const signedPSBT = signPSBT(psbt, getEscrowWalletForOffer(sellOffer))
  const { result: patchOfferResult, error: patchOfferError } = await peachAPI.private.offer.patchOffer({
    offerId: sellOffer.id,
    refundTx: signedPSBT.toBase64(),
  })
  if (!patchOfferResult || patchOfferError) {
    return { result: { sellOffer }, error: patchOfferError?.error || 'UNKNOWN_ERROR' }
  }

  return {
    result: {
      sellOffer: {
        ...sellOffer,
        refundTx: psbt.toBase64(),
      },
    },
  }
}
