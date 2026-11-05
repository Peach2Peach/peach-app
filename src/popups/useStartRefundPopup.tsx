import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useClosePopup, useSetPopup } from "../components/popup/GlobalPopup";
import { FIFTEEN_SECONDS } from "../constants";
import { getOfferQuery } from "../hooks/query/getOfferQuery";
import { offerKeys } from "../hooks/query/useOfferDetail";
import { useRefundSellOffer } from "../hooks/useRefundSellOffer";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import { getAbortWithTimeout } from "../utils/getAbortWithTimeout";
import i18n from "../utils/i18n";
import { isSellOffer } from "../utils/offer/isSellOffer";
import { peachAPI } from "../utils/peachAPI";
import { LoadingPopup } from "./LoadingPopup";

export const useStartRefundPopup = () => {
  const { mutate: refundSellOffer } = useRefundSellOffer();
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const showError = useShowErrorBanner();
  const queryClient = useQueryClient();

  const startRefundPopup = useCallback(
    async (sellOffer: SellOffer) => {
      setPopup(<LoadingPopup title={i18n("refund.loading.title")} />);

      // The refund PSBT is validated against the offer (funding txIds,
      // returnAddress). The caller's offer can be a cached copy from before the
      // trade was canceled, so always validate against a fresh one.
      const [freshOffer, { result: refundPsbtResult, error: refundPsbtError }] =
        await Promise.all([
          queryClient
            .fetchQuery({
              queryKey: offerKeys.detail(sellOffer.id),
              queryFn: getOfferQuery,
              staleTime: 0,
            })
            .catch(() => undefined),
          peachAPI.private.offer.getRefundPSBT({
            offerId: sellOffer.id,
            signal: getAbortWithTimeout(FIFTEEN_SECONDS).signal,
          }),
        ]);
      if (!freshOffer || !isSellOffer(freshOffer)) {
        showError("NETWORK_ERROR");
        closePopup();
        return;
      }
      if (refundPsbtResult) {
        refundSellOffer({
          sellOffer: freshOffer,
          rawPSBT: refundPsbtResult.psbt,
        });
      } else {
        showError(refundPsbtError?.error);
        closePopup();
      }
    },
    [closePopup, queryClient, refundSellOffer, setPopup, showError],
  );

  return startRefundPopup;
};
