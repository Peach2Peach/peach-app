import { useCallback } from "react";
import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { ClosePopupAction } from "../components/popup/actions/ClosePopupAction";
import { useStackNavigation } from "../hooks/useStackNavigation";
import { useTranslate } from "@tolgee/react";

export function BuyOfferExpiredPopup({
  offerId,
  days,
}: {
  offerId: string;
  days: string;
}) {
  const closePopup = useClosePopup();
  const navigation = useStackNavigation();
  const goToContact = useCallback(() => {
    closePopup();
    navigation.navigate("contact");
  }, [closePopup, navigation]);
  const { t } = useTranslate("notification");

  return (
    <PopupComponent
      title={t("notification.offer.buyOfferExpired.title")}
      content={t("notification.offer.buyOfferExpired.text", {
        offer: offerId,
        date: days,
      })}
      actions={
        <>
          <PopupAction
            label={t({ key: "help", ns: "help" })}
            iconId="helpCircle"
            onPress={goToContact}
          />
          <ClosePopupAction reverseOrder />
        </>
      }
    />
  );
}
