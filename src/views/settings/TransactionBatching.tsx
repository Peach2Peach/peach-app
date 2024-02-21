import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { Toggle } from "../../components/inputs/Toggle";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useToggleBatching } from "../../hooks/user/useToggleBatching";
import { useTradeSummaryStore } from "../../store/tradeSummaryStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { LoadingScreen } from "../loading/LoadingScreen";
import { useTranslate } from "@tolgee/react";

export const TransactionBatching = () => {
  const { t } = useTranslate("settings");
  const { user, isLoading } = useSelfUser();
  const { mutate } = useToggleBatching(user || { isBatchingEnabled: false });
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const contracts = useTradeSummaryStore((state) => state.contracts);
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
      header={t("settings.transactionBatching")}
    >
      <View style={tw`gap-4`}>
        <PeachText style={tw`body-l`}>
          {t(
            isBatchingEnabled
              ? "settings.batching.delayedPayouts"
              : "settings.batching.immediatePayouts",
          )}
        </PeachText>
        <ParsedPeachText
          style={tw`body-l`}
          parse={[
            {
              pattern: new RegExp(
                t(
                  isBatchingEnabled
                    ? "settings.batching.youSave.highlight"
                    : "settings.batching.youPay.highlight",
                ),
                "u",
              ),
              style: tw`text-primary-main`,
            },
          ]}
        >
          {i18n.break(
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
