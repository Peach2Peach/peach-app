import { useCallback } from "react";
import { useClosePopup, useSetPopup } from "../components/popup/Popup";
import { useRefundEscrow } from "../hooks/useRefundEscrow";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import i18n from "../utils/i18n";
import { LoadingPopup } from "./LoadingPopup";
import { useCancelOffer } from "./useCancelOffer";

export const useCancelAndStartRefundPopup = () => {
  const refundEscrow = useRefundEscrow();
  const closePopup = useClosePopup();
  const setPopup = useSetPopup();
  const showError = useShowErrorBanner();
  const { mutate: cancelOffer } = useCancelOffer();

  const cancelAndStartRefundPopup = useCallback(
    (sellOffer: SellOffer) => {
      setPopup(<LoadingPopup title={i18n("refund.loading.title")} />);

      cancelOffer(sellOffer.id, {
        onError: (error) => {
          showError(error.message);
          closePopup();
        },
        onSuccess: (result) => {
          if ("psbt" in result) {
            return refundEscrow(sellOffer, result.psbt);
          }
          return null;
        },
      });
    },
    [cancelOffer, closePopup, refundEscrow, setPopup, showError],
  );

  return cancelAndStartRefundPopup;
};
