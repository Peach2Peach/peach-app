import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Toggle } from "../../components/inputs/Toggle";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { useContractSummaries } from "../../hooks/query/useContractSummaries";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useToggleBatching } from "../../hooks/user/useToggleBatching";
import tw from "../../styles/tailwind";
import { LoadingScreen } from "../loading/LoadingScreen";
import { useTranslate } from "@tolgee/react";

export const TransactionBatching = () => {
  const { t } = useTranslate("batching");
  const { user, isLoading } = useSelfUser();
  const { mutate } = useToggleBatching(user || { isBatchingEnabled: false });
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { contracts } = useContractSummaries();
  const toggleBatching = () => {
    const hasPendingPayouts = contracts.some(
      (contract) => contract.tradeStatus === "payoutPending",
    );
    if (user?.isBatchingEnabled && hasPendingPayouts) {
      setPopup(
        <PopupComponent
          title={t("settings.batching.turnOff.title")}
          content={t("settings.batching.turnOff.description")}
          actions={
            <>
              <PopupAction
                label={t("settings.batching.turnOff.no")}
                iconId="xCircle"
                onPress={closePopup}
              />
              <PopupAction
                label={t("settings.batching.turnOff.yes")}
                iconId="arrowRightCircle"
                onPress={() => {
                  mutate();
                  closePopup();
                }}
                reverseOrder
              />
            </>
          }
        />,
      );
    } else {
      mutate();
    }
  };
  const isBatchingEnabled = !!user?.isBatchingEnabled;

  if (isLoading) return <LoadingScreen />;
  return (
    <Screen
      style={tw`justify-center gap-8`}
      header={t("settings.transactionBatching", { ns: "settings" })}
    >
      <View style={tw`gap-4`}>
        <PeachText style={tw`body-l`}>
          {isBatchingEnabled
            ? t("settings.batching.delayedPayouts")
            : t("settings.batching.immediatePayouts")}
        </PeachText>
        <ParsedPeachText
          style={tw`body-l`}
          parse={[
            {
              pattern: new RegExp(
                isBatchingEnabled
                  ? t("settings.batching.youSave.highlight")
                  : t("settings.batching.youPay.highlight"),
                "u",
              ),
              style: tw`text-primary-main`,
            },
          ]}
        >
          {t(
            isBatchingEnabled
              ? "settings.batching.youSave"
              : "settings.batching.youPay",
          )}
        </ParsedPeachText>
      </View>
      <Toggle enabled={isBatchingEnabled} onPress={toggleBatching}>
        {t("settings.batching.toggle")}
      </Toggle>
    </Screen>
  );
};
