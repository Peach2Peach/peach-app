import { useCallback } from "react";
import { useClosePopup, useSetPopup } from "../components/popup/Popup";
import { FIFTEEN_SECONDS } from "../constants";
import { LoadingPopup } from "../hooks/LoadingPopup";
import { useRefundEscrow } from "../hooks/useRefundEscrow";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import { getAbortWithTimeout } from "../utils/getAbortWithTimeout";
import i18n from "../utils/i18n";
import { peachAPI } from "../utils/peachAPI";

export const useStartRefundPopup = () => {
  const refundEscrow = useRefundEscrow();
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const showError = useShowErrorBanner();

  const startRefundPopup = useCallback(
    async (sellOffer: SellOffer) => {
      setPopup(<LoadingPopup title={i18n("refund.loading.title")} />);

      const { result: refundPsbtResult, error: refundPsbtError } =
        await peachAPI.private.offer.getRefundPSBT({
          offerId: sellOffer.id,
          signal: getAbortWithTimeout(FIFTEEN_SECONDS).signal,
        });
      if (refundPsbtResult) {
        await refundEscrow(sellOffer, refundPsbtResult.psbt);
      } else {
        showError(refundPsbtError?.error);
        closePopup();
      }
    },
    [closePopup, refundEscrow, setPopup, showError],
  );

  return startRefundPopup;
};
