import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { useStackNavigation } from "../hooks/useStackNavigation";
import i18n from "../utils/i18n";
import { offerIdToHex } from "../utils/offer/offerIdToHex";

export function OfferOutsideRangePopup({ offerId }: { offerId: string }) {
  const closePopup = useClosePopup();
  const navigation = useStackNavigation();
  const goToOffer = () => {
    closePopup();
    navigation.navigate("offer", { offerId });
  };

  return (
    <PopupComponent
      title={i18n("notification.offer.outsideRange.title")}
      content={i18n(
        "notification.offer.outsideRange.text",
        offerIdToHex(offerId),
      )}
      actions={
        <>
          <ClosePopupAction />
          <PopupAction
            label={i18n("goToOffer")}
            iconId="arrowLeftCircle"
            onPress={goToOffer}
            reverseOrder
          />
        </>
      }
    />
  );
}
