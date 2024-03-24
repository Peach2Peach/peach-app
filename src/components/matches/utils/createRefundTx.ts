import { SellOffer } from "../../../../peach-api/src/@types/offer";
import { checkRefundPSBT } from "../../../utils/bitcoin/checkRefundPSBT";
import { peachAPI } from "../../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../../utils/wallet/getEscrowWalletForOffer";
import { signPSBT } from "../../../utils/wallet/signPSBT";

export const createRefundTx = async (
  offer: SellOffer,
  refundTx: string,
): Promise<string | undefined> => {
  let currentRefundTx = offer.refundTx;
  const { isValid, psbt } = checkRefundPSBT(refundTx, offer);
  if (isValid && psbt) {
    const signedPSBT = signPSBT(psbt, getEscrowWalletForOffer(offer));
    const { result: patchOfferResult } =
      await peachAPI.private.offer.patchOffer({
        offerId: offer.id,
        refundTx: signedPSBT.toBase64(),
      });
    if (patchOfferResult) currentRefundTx = psbt.toBase64();
  }
  return currentRefundTx;
};
