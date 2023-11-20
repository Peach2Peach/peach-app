import { checkRefundPSBT } from '../../../utils/bitcoin'
import { getSellOfferFromContract } from '../../../utils/contract'
import { patchOffer } from '../../../utils/peachAPI'
import { getEscrowWalletForOffer, signPSBT } from '../../../utils/wallet'

export const patchSellOfferWithRefundTx = async (contract: Contract, refundPSBT: string) => {
  const sellOffer = getSellOfferFromContract(contract)
  const { isValid, psbt, err: checkRefundPSBTError } = checkRefundPSBT(refundPSBT, sellOffer)

  if (checkRefundPSBTError) return { result: { sellOffer }, error: checkRefundPSBTError }
  if (!isValid || !psbt) return { result: { sellOffer }, error: 'UNKNOWN_ERROR' }

  const signedPSBT = signPSBT(psbt, getEscrowWalletForOffer(sellOffer))
  const [patchOfferResult, patchOfferError] = await patchOffer({
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
