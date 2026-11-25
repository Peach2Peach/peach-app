import OpenPGP from "react-native-fast-openpgp";
import { useAccountStore } from "../account/account";
import { error } from "../log/error";
import { peachAPI } from "../peachAPI";

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** must match the server: "<oldOfferId>-<sellOfferId>" */
export const getOldOfferIdDeclarationMessage = (
  oldOfferId: string,
  sellOfferId: string,
) => `${oldOfferId}-${sellOfferId}`;

/**
 * after a sell offer is revived (republished), the seller PGP-signs
 * "<oldOfferId>-<newOfferId>". oldOfferId is read from the new offer itself:
 * the server sets it to the ORIGINAL offer, not the one just republished.
 * Tries once plus up to MAX_RETRIES retries, RETRY_INTERVAL apart. Each attempt
 * re-reads the offer, so a failed GET is retried too.
 * Never throws: resolves to whether the signature got stored.
 */
export async function submitOldOfferIdSignature(
  sellOfferId: string,
): Promise<boolean> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    // sequential on purpose: each retry waits for the previous attempt
    // eslint-disable-next-line no-await-in-loop
    if (attempt > 0) await sleep(RETRY_INTERVAL);
    const label = `oldOfferIdSignature (attempt ${attempt + 1}/${MAX_RETRIES + 1})`;
    try {
      const { result: sellOffer, error: getError } =
        // eslint-disable-next-line no-await-in-loop
        await peachAPI.private.peach069.getSellOfferById({ sellOfferId });
      if (!sellOffer)
        throw new Error(`offer not loaded: ${JSON.stringify(getError)}`);
      if (sellOffer.oldOfferIdSignature) return true;
      if (!sellOffer.oldOfferId) {
        // nothing to declare: retrying will not change that
        error(`${label} offer has no oldOfferId`, sellOfferId);
        return false;
      }

      const message = getOldOfferIdDeclarationMessage(
        sellOffer.oldOfferId,
        sellOfferId,
      );
      const { privateKey } = useAccountStore.getState().account.pgp;
      // eslint-disable-next-line no-await-in-loop
      const oldOfferIdSignature = await OpenPGP.sign(message, privateKey, "");

      const { result, error: apiError } =
        // eslint-disable-next-line no-await-in-loop
        await peachAPI.private.peach069.submitSellOfferOldOfferIdSignature({
          sellOfferId,
          oldOfferIdSignature,
        });
      if (result?.success) return true;
      error(
        `${label} rejected`,
        `offer ${sellOfferId}`,
        `server: ${JSON.stringify(apiError)}`,
        `signed: "${message}"`,
      );
    } catch (e) {
      error(`${label} failed`, sellOfferId, e);
    }
  }
  return false;
}
