import { useState } from "react";
import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { LoadingPopupAction } from "../components/popup/actions/LoadingPopupAction";
import { useStackNavigation } from "../hooks/useStackNavigation";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";

export function CancelBuyOffer68Popup({
  cancelFunction,
}: {
  cancelFunction: Function;
}) {
  const navigation = useStackNavigation();
  const closePopup = useClosePopup();

  const [isLoading, setIsLoading] = useState(false);

  const confirmCancelOffer = async () => {
    setIsLoading(true);

    await cancelFunction();
    navigation.navigate("homeScreen", { screen: "home" });
  };

  return (
    <PopupComponent
      title={i18n("offer.cancel.popup.title")}
      content={i18n("search.popups.cancelOffer.text.buy")}
      actionBgColor={tw`bg-black-50`}
      bgColor={tw`bg-primary-background-light-color`}
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
            loading={isLoading}
            reverseOrder
          />
        </>
      }
    />
  );
}
