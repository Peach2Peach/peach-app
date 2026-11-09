import { useAccountStore } from "../account/account";
import { peachAPI } from "../peachAPI";
import { getWallet } from "../wallet/getWallet";
import { getBuyOfferPublicKeyProof } from "./getBuyOfferPublicKeyProof";

const KEY_ALREADY_SUBMITTED = "Public key already submitted";

/**
 * @description makes a created Buy Offer public. Safe to retry: the key is
 * derived from the offer id, so every attempt submits the same one.
 */
export const submitBuyOfferPublicKey = async (buyOfferId: string) => {
  const { error: err } = await peachAPI.private.peach069.submitBuyOfferPublicKey(
    {
      buyOfferId,
      ...getBuyOfferPublicKeyProof(
        getWallet(),
        useAccountStore.getState().account.publicKey,
        buyOfferId,
      ),
    },
  );
  if (!err) return;

  if (err.error === KEY_ALREADY_SUBMITTED) {
    const { result } = await peachAPI.private.peach069.getBuyOfferById({
      buyOfferId,
    });
    if (result?.publicKey) return;
  }
  throw new Error(err.error, { cause: err.details });
};
