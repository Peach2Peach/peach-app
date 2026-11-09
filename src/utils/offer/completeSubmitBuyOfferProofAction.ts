import { useAccountStore } from "../account/account";
import { peachAPI } from "../peachAPI";
import { getWallet } from "../wallet/getWallet";
import { getBuyOfferPublicKeyProof } from "./getBuyOfferPublicKeyProof";

// 403: the action was closed. "already submitted": the key is set or the offer
// is no longer active. Either way the user has nothing left to do.
const ALREADY_HANDLED_ERRORS = ["FORBIDDEN", "Public key already submitted"];

/**
 * @description approves a Buy Offer created on desktop, with the same key the
 * mobile flow would have used for that offer.
 * @returns false if the action had already been handled
 */
export const completeSubmitBuyOfferProofAction = async ({
  id,
  buyOfferId,
}: {
  id: string;
  buyOfferId: string;
}) => {
  const { error: err } =
    await peachAPI.private.peach069.postMobilePendingActionSubmitBuyOfferProof({
      id,
      ...getBuyOfferPublicKeyProof(
        getWallet(),
        useAccountStore.getState().account.publicKey,
        buyOfferId,
      ),
    });
  if (!err) return true;
  if (ALREADY_HANDLED_ERRORS.includes(err.error)) return false;

  throw new Error(err.error, { cause: err.details });
};
