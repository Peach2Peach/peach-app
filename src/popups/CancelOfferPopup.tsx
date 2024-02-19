import { useQueryClient } from "@tanstack/react-query";
import { useClosePopup, useSetPopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { LoadingPopupAction } from "../components/popup/actions/LoadingPopupAction";
import { offerKeys, useOfferDetail } from "../hooks/query/useOfferDetail";
import { useShowErrorBanner } from "../hooks/useShowErrorBanner";
import { useStackNavigation } from "../hooks/useStackNavigation";
import tw from "../styles/tailwind";
import { isBuyOffer } from "../utils/offer/isBuyOffer";
import { isSellOffer } from "../utils/offer/isSellOffer";
import { saveOffer } from "../utils/offer/saveOffer";
import { GrayPopup } from "./GrayPopup";
import { useCancelOffer } from "./useCancelOffer";
import { useStartRefundPopup } from "./useStartRefundPopup";
import { useTranslate } from "@tolgee/react";

export function CancelOfferPopup({ offerId }: { offerId: string }) {
  const navigation = useStackNavigation();
  const showErrorBanner = useShowErrorBanner();
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const queryClient = useQueryClient();
  const { offer } = useOfferDetail(offerId);
  const { mutate: cancelOffer } = useCancelOffer();

  const startRefund = useStartRefundPopup();
  const { t } = useTranslate("unassigned");

  const confirmCancelOffer = () => {
    if (!offer) return;

    cancelOffer(offerId, {
      onSuccess: (result) => {
        if (result) {
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
          if (
            isBuyOffer(offer) ||
            offer.funding.status === "NULL" ||
            offer.funding.txIds.length === 0
          ) {
            setPopup(
              <GrayPopup
                title={t({ key: "offer.canceled.popup.title", ns: "offer" })}
                actions={<ClosePopupAction style={tw`justify-center`} />}
              />,
            );
            navigation.navigate("homeScreen", { screen: "home" });
          } else {
            startRefund(offer);
          }
        }
      },
      onError: (err) => {
        showErrorBanner(err.message);
      },
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
    });
  };

  if (!offer) return null;
  return (
    <PopupComponent
      title={t({ key: "offer.cancel.popup.title", ns: "offer" })}
      content={t(
        offer.type === "bid"
          ? { key: "search.popups.cancelOffer.text.buy", ns: "unassigned" }
          : { key: "offer.cancel.popup.description", ns: "offer" },
      )}
      actionBgColor={tw`bg-black-50`}
      bgColor={tw`bg-primary-background-light`}
      actions={
        <>
          <PopupAction
            label={t("neverMind")}
            iconId="arrowLeftCircle"
            onPress={closePopup}
          />
          <LoadingPopupAction
            label={t("cancelOffer")}
            iconId="xCircle"
            onPress={confirmCancelOffer}
            reverseOrder
          />
        </>
      }
    />
  );
}
