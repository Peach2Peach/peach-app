import { useCallback } from "react";
import { useClosePopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { WarningPopup } from "../WarningPopup";

type Source = "paymentData" | "refundAddress";

export function InvalidServerSignaturePopup({ source }: { source: Source }) {
  const closePopup = useClosePopup();
  const navigation = useStackNavigation();
  const goToContact = useCallback(() => {
    closePopup();
    navigation.navigate("contact", {});
  }, [closePopup, navigation]);

  return (
    <WarningPopup
      title={i18n("invalidServerSignature.title")}
      content={i18n(`invalidServerSignature.${source}`)}
      actions={
        <>
          <ClosePopupAction textStyle={tw`text-black-100`} />
          <PopupAction
            label={i18n("contactUs")}
            iconId="mail"
            textStyle={tw`text-black-100`}
            onPress={goToContact}
            reverseOrder
          />
        </>
      }
    />
  );
}
