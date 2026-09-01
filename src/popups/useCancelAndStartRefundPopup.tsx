import { useCallback } from "react";
import { useClosePopup, useSetPopup } from "../components/popup/GlobalPopup";
import { useRefundSellOffer } from "../hooks/useRefundSellOffer";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import i18n from "../utils/i18n";
import { LoadingPopup } from "./LoadingPopup";
import { useCancelOffer } from "./useCancelOffer";
import { useStartRefundPopup } from "./useStartRefundPopup";

export const useCancelAndStartRefundPopup = () => {
  const { mutate: refundSellOffer } = useRefundSellOffer();
  const closePopup = useClosePopup();
  const setPopup = useSetPopup();
  const showError = useShowErrorBanner();
  const { mutate: cancelOffer } = useCancelOffer();
  const startRefund = useStartRefundPopup();

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
            return refundSellOffer({ sellOffer, rawPSBT: result.psbt });
          }
          // cancelation did not hand us a refund PSBT, so ask for one
          return startRefund(sellOffer);
        },
      });
    },
    [cancelOffer, closePopup, refundSellOffer, setPopup, showError, startRefund],
  );

  return cancelAndStartRefundPopup;
};
