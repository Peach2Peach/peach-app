import { useAccountStore } from "../account/account";
import { getInstantTradeDeclarationMessage } from "../account/getInstantTradeDeclarationMessage";
import { signWithPeachUserKey } from "../account/signWithPeachUserKey";
import { error } from "../log/error";
import { peachAPI } from "../peachAPI";
import { isInstantTradeSellOffer } from "./isInstantTradeSellOffer";

const MAX_RETRIES = 4;
const RETRY_INTERVAL = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * declares, signed with the Peach ID key, whether a sell offer is an instant
 * trade offer (decided like the server does, see isInstantTradeSellOffer).
 * Tries once plus up to MAX_RETRIES retries, RETRY_INTERVAL apart.
 * Never throws: resolves to whether the signature got stored.
 */
export async function submitInstantTradeSignature(
  sellOffer: { id: string } & Parameters<typeof isInstantTradeSellOffer>[0],
): Promise<boolean> {
  const sellOfferId = sellOffer.id;
  const isInstantTrade = isInstantTradeSellOffer(sellOffer);
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    // sequential on purpose: each retry waits for the previous attempt
    // eslint-disable-next-line no-await-in-loop
    if (attempt > 0) await sleep(RETRY_INTERVAL);
    const userId = useAccountStore.getState().account.publicKey;
    const message = getInstantTradeDeclarationMessage(
      userId,
      sellOfferId,
      isInstantTrade,
    );
    try {
      const instantTradeSignature = signWithPeachUserKey(message);
      const { result, error: apiError } =
        // eslint-disable-next-line no-await-in-loop
        await peachAPI.private.peach069.submitSellOfferInstantTradeSignature({
          sellOfferId,
          instantTradeSignature,
        });
      if (result?.success) return true;
      error(
        `instantTradeSignature rejected (attempt ${attempt + 1}/${MAX_RETRIES + 1})`,
        `offer ${sellOfferId}`,
        `server: ${JSON.stringify(apiError)}`,
        `signed: "${message}"`,
      );
    } catch (e) {
      error(
        `instantTradeSignature failed (attempt ${attempt + 1}/${MAX_RETRIES + 1})`,
        `offer ${sellOfferId}`,
        `signed: "${message}"`,
        e,
      );
    }
  }
  return false;
}
