import { useCallback } from "react";
import { useClosePopup } from "../components/popup/Popup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { useNavigation } from "../hooks/useNavigation";
import i18n from "../utils/i18n";

export function BuyOfferExpiredPopup({
  offerId,
  days,
}: {
  offerId: string;
  days: string;
}) {
  const closePopup = useClosePopup();
  const navigation = useNavigation();
  const goToContact = useCallback(() => {
    closePopup();
    navigation.navigate("contact");
  }, [closePopup, navigation]);

  return (
    <PopupComponent
      title={i18n("notification.offer.buyOfferExpired.title")}
      content={i18n("notification.offer.buyOfferExpired.text", offerId, days)}
      actions={
        <>
          <PopupAction
            label={i18n("help")}
            iconId="helpCircle"
            onPress={goToContact}
          />
          <ClosePopupAction reverseOrder />
        </>
      }
    />
  );
}
