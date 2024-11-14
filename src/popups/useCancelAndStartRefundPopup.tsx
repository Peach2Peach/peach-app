import { useCallback } from "react";
import { SellOffer } from "../../peach-api/src/@types/offer";
import { useClosePopup, useSetPopup } from "../components/popup/GlobalPopup";
import { useRefundSellOffer } from "../hooks/useRefundSellOffer";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import i18n from "../utils/i18n";
import { LoadingPopup } from "./LoadingPopup";
import { useCancelOffer } from "./useCancelOffer";

export const useCancelAndStartRefundPopup = () => {
  const { mutate: refundSellOffer } = useRefundSellOffer();
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
            return refundSellOffer({ sellOffer, rawPSBT: result.psbt });
          }
          return null;
        },
      });
    },
    [cancelOffer, closePopup, refundSellOffer, setPopup, showError],
  );

  return cancelAndStartRefundPopup;
};
