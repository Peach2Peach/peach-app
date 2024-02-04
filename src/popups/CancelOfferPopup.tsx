import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useClosePopup, useSetPopup } from "../components/popup/Popup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { LoadingPopupAction } from "../components/popup/actions/LoadingPopupAction";
import { offerKeys, useOfferDetail } from "../hooks/query/useOfferDetail";
import { useNavigation } from "../hooks/useNavigation";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { isBuyOffer } from "../utils/offer/isBuyOffer";
import { isSellOffer } from "../utils/offer/isSellOffer";
import { saveOffer } from "../utils/offer/saveOffer";
import { peachAPI } from "../utils/peachAPI";
import { GrayPopup } from "./GrayPopup";
import { useStartRefundPopup } from "./useStartRefundPopup";

export function CancelOfferPopup({ offerId }: { offerId: string }) {
  const navigation = useNavigation();
  const showError = useShowErrorBanner();
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const queryClient = useQueryClient();
  const { offer } = useOfferDetail(offerId);

  const startRefund = useStartRefundPopup();

  const confirmCancelOffer = useCallback(async () => {
    if (!offer) return;
    const [cancelResult, cancelError] = await cancelAndSaveOffer(offer);

    if (!cancelResult || cancelError) {
      showError(cancelError?.error);
      return;
    }

    if (
      isBuyOffer(offer) ||
      offer.funding.status === "NULL" ||
      offer.funding.txIds.length === 0
    ) {
      setPopup(
        <GrayPopup
          title={i18n("offer.canceled.popup.title")}
          actions={<ClosePopupAction style={tw`justify-center`} />}
        />,
      );
      navigation.navigate("homeScreen", { screen: "home" });
    } else {
      startRefund(offer);
    }
    queryClient.refetchQueries({ queryKey: offerKeys.summaries() });
  }, [navigation, offer, queryClient, setPopup, showError, startRefund]);

  if (!offer) return null;
  return (
    <PopupComponent
      title={i18n("offer.cancel.popup.title")}
      content={i18n(
        offer.type === "bid"
          ? "search.popups.cancelOffer.text.buy"
          : "offer.cancel.popup.description",
      )}
      actionBgColor={tw`bg-black-50`}
      bgColor={tw`bg-primary-background-light`}
      actions={
        <>
          <PopupAction
            label={i18n("neverMind")}
            iconId="arrowLeftCircle"
            onPress={closePopup}
          />
          <LoadingPopupAction
            label={i18n("cancelOffer")}
            iconId="xCircle"
            onPress={confirmCancelOffer}
            reverseOrder
          />
        </>
      }
    />
  );
}

async function cancelAndSaveOffer(offer: BuyOffer | SellOffer) {
  if (!offer.id) return [null, { error: "GENERAL_ERROR" }] as const;

  const { result, error: err } = await peachAPI.private.offer.cancelOffer({
    offerId: offer.id,
  });
  if (result) {
    info("Cancel offer: ", JSON.stringify(result));
    if (isSellOffer(offer)) {
      saveOffer({
        ...offer,
        online: false,
        funding: {
          ...offer.funding,
          status: "CANCELED",
        },
      });
    } else {
      saveOffer({ ...offer, online: false });
    }
  } else if (err) {
    error("Error", err);
  }

  return [result, err] as const;
}
