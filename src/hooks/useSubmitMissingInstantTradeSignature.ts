import { useEffect, useRef } from "react";
import { submitInstantTradeSignature } from "../utils/offer/submitInstantTradeSignature";

type OfferLike = Parameters<typeof submitInstantTradeSignature>[0] & {
  instantTradeSignature?: string | null;
};

/**
 * the instant trade declaration is normally submitted right after the offer is
 * created. If that failed (the server returns `null`), submit it here, at most
 * once per offer while the calling screen is mounted.
 * `undefined` means the server does not support it yet, so nothing is sent.
 */
export function useSubmitMissingInstantTradeSignature(
  sellOffers: (OfferLike | undefined)[],
) {
  const attempted = useRef(new Set<string>());
  const missing = sellOffers.filter(
    (offer): offer is OfferLike =>
      !!offer && offer.instantTradeSignature === null,
  );
  const missingKey = missing.map((offer) => offer.id).join(",");

  useEffect(() => {
    missing.forEach((offer) => {
      if (attempted.current.has(offer.id)) return;
      attempted.current.add(offer.id);
      submitInstantTradeSignature(offer);
    });
    // only re-run when the set of offers missing a signature changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingKey]);
}
