import { checkRefundPSBT } from "../../utils/bitcoin/checkRefundPSBT";
import { getSellOfferFromContract } from "../../utils/contract/getSellOfferFromContract";
import { saveOffer } from "../../utils/offer/saveOffer";
import { peachAPI } from "../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../utils/wallet/getEscrowWalletForOffer";
import { signPSBT } from "../../utils/wallet/signPSBT";
import { validateRefundAddressOwnership } from "../../utils/wallet/validateRefundAddressOwnership";

export async function patchSellOfferWithRefundTx(
  contract: Contract,
  refundPSBT: string,
) {
  const sellOffer = await getSellOfferFromContract(contract);
  if (!sellOffer) throw new Error("No sell offer found for contract");
  const { isValid, psbt, err } = checkRefundPSBT(refundPSBT, sellOffer);
  if (err || !isValid || !psbt) return;

  validateRefundAddressOwnership(psbt);
  const signedPSBT = signPSBT(psbt, getEscrowWalletForOffer(sellOffer));
  const { result: patchOfferResult, error: patchOfferError } =
    await peachAPI.private.offer.patchOffer({
      offerId: sellOffer.id,
      refundTx: signedPSBT.toBase64(),
    });
  if (!patchOfferResult || patchOfferError) return;
  saveOffer({ ...sellOffer, refundTx: psbt.toBase64() });
}
