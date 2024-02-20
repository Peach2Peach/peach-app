import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { useStackNavigation } from "../hooks/useStackNavigation";
import { offerIdToHex } from "../utils/offer/offerIdToHex";
import { useTranslate } from "@tolgee/react";

export function OfferOutsideRangePopup({ offerId }: { offerId: string }) {
  const closePopup = useClosePopup();
  const navigation = useStackNavigation();
  const goToOffer = () => {
    closePopup();
    navigation.navigate("offer", { offerId });
  };
  const { t } = useTranslate("notification");

  return (
    <PopupComponent
      title={t("notification.offer.outsideRange.title")}
      content={t("notification.offer.outsideRange.text", offerIdToHex(offerId))}
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            label={t("goToOffer")}
            iconId="arrowLeftCircle"
            onPress={goToOffer}
            reverseOrder
          />
        </>
      }
    />
  );
}
