import { useState } from "react";
import { useClosePopup } from "../components/popup/GlobalPopup";
import { PopupAction } from "../components/popup/PopupAction";
import { PopupComponent } from "../components/popup/PopupComponent";
import { LoadingPopupAction } from "../components/popup/actions/LoadingPopupAction";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";

export function RejectTradeRequestPopup({
  rejectFunction,
}: {
  rejectFunction: Function;
}) {
  const closePopup = useClosePopup();

  const [isLoading, setIsLoading] = useState(false);

  const confirmRejectTradeRequest = async () => {
    setIsLoading(true);

    await rejectFunction();
  };

  return (
    <PopupComponent
      title={i18n("tradeRequest.reject.popup.title")}
      content={i18n("tradeRequest.reject.popup.text")}
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
            label={i18n("rejectTradeRequest")}
            iconId="xCircle"
            onPress={confirmRejectTradeRequest}
            loading={isLoading}
            reverseOrder
          />
        </>
      }
    />
  );
}
