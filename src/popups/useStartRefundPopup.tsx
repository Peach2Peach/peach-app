import { useCallback } from "react";
import { useClosePopup, useSetPopup } from "../components/popup/GlobalPopup";
import { FIFTEEN_SECONDS } from "../constants";
import { useRefundSellOffer } from "../hooks/useRefundSellOffer";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import { getAbortWithTimeout } from "../utils/getAbortWithTimeout";
import { peachAPI } from "../utils/peachAPI";
import { LoadingPopup } from "./LoadingPopup";
import { useTranslate } from "@tolgee/react";

export const useStartRefundPopup = () => {
  const { mutate: refundSellOffer } = useRefundSellOffer();
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const showError = useShowErrorBanner();
  const { t } = useTranslate();

  const startRefundPopup = useCallback(
    async (sellOffer: SellOffer) => {
      setPopup(<LoadingPopup title={t("refund.loading.title")} />);

      const { result: refundPsbtResult, error: refundPsbtError } =
        await peachAPI.private.offer.getRefundPSBT({
          offerId: sellOffer.id,
          signal: getAbortWithTimeout(FIFTEEN_SECONDS).signal,
        });
      if (refundPsbtResult) {
        refundSellOffer({ sellOffer, rawPSBT: refundPsbtResult.psbt });
      } else {
        showError(refundPsbtError?.error);
        closePopup();
      }
    },
    [closePopup, refundSellOffer, setPopup, showError, t],
  );

  return startRefundPopup;
};
