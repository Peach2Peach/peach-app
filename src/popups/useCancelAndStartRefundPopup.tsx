import { useCallback } from "react";
import { useClosePopup, useSetPopup } from "../components/popup/Popup";
import { FIFTEEN_SECONDS } from "../constants";
import { useRefundEscrow } from "../hooks/useRefundEscrow";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import { getAbortWithTimeout } from "../utils/getAbortWithTimeout";
import i18n from "../utils/i18n";
import { peachAPI } from "../utils/peachAPI";
import { LoadingPopup } from "./LoadingPopup";

export const useCancelAndStartRefundPopup = () => {
  const refundEscrow = useRefundEscrow();
  const closePopup = useClosePopup();
  const setPopup = useSetPopup();
  const showError = useShowErrorBanner();

  const cancelAndStartRefundPopup = useCallback(
    async (sellOffer: SellOffer) => {
      setPopup(<LoadingPopup title={i18n("refund.loading.title")} />);

      const { result: refundPsbtResult, error: refundPsbtError } =
        await peachAPI.private.offer.cancelOffer({
          offerId: sellOffer.id,
          signal: getAbortWithTimeout(FIFTEEN_SECONDS).signal,
        });
      if (refundPsbtResult && "psbt" in refundPsbtResult) {
        await refundEscrow(sellOffer, refundPsbtResult.psbt);
      } else {
        showError(refundPsbtError?.error);
        closePopup();
      }
    },
    [closePopup, refundEscrow, setPopup, showError],
  );

  return cancelAndStartRefundPopup;
};
