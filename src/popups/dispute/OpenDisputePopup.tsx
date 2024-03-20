import { useCallback } from "react";
import { View } from "react-native";
import { useClosePopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { PeachText } from "../../components/text/PeachText";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import { ErrorPopup } from "../ErrorPopup";
import { useTranslate } from "@tolgee/react";

export function OpenDisputePopup({ contractId }: { contractId: string }) {
  const navigation = useStackNavigation();
  const closePopup = useClosePopup();
  const { t } = useTranslate("contract");

  const ok = useCallback(() => {
    closePopup();
    navigation.navigate("disputeReasonSelector", { contractId });
  }, [closePopup, contractId, navigation]);

  return (
    <ErrorPopup
      title={t("dispute.openDispute")}
      content={
        <View style={tw`gap-3`}>
          <PeachText>{t("dispute.openDispute.text.1")}</PeachText>
          <PeachText>{t("dispute.openDispute.text.2")}</PeachText>
          <PeachText>{t("dispute.openDispute.text.3")}</PeachText>
        </View>
      }
      actions={
        <>
          <PopupAction
            label={t("dispute.openDispute")}
            iconId="alertOctagon"
            onPress={ok}
          />
          <ClosePopupAction reverseOrder />
        </>
      }
    />
  );
}
