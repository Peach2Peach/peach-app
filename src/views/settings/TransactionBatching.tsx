import { View } from "react-native";
import { Header } from "../../components/Header";
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
import { HelpPopup } from "../../popups/HelpPopup";
import { useThemeStore } from "../../store/theme"; // Import theme store for dark mode check
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { LoadingScreen } from "../loading/LoadingScreen";

export const TransactionBatching = () => {
  const { user, isLoading } = useSelfUser();
  const { mutate } = useToggleBatching(user || { isBatchingEnabled: false });
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { contracts } = useContractSummaries();
  const { isDarkMode } = useThemeStore(); // Access dark mode state

  const toggleBatching = () => {
    const hasPendingPayouts = contracts.some(
      (contract) => contract.tradeStatus === "payoutPending",
    );
    if (user?.isBatchingEnabled && hasPendingPayouts) {
      setPopup(
        <PopupComponent
          title={i18n("settings.batching.turnOff.title")}
          content={i18n("settings.batching.turnOff.description")}
          actions={
            <>
              <PopupAction
                label={i18n("settings.batching.turnOff.no")}
                iconId="xCircle"
                onPress={closePopup}
              />
              <PopupAction
                label={i18n("settings.batching.turnOff.yes")}
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
      header={<TransactionBatchingHeader />}
    >
      <View style={tw`gap-4`}>
        <PeachText
          style={tw`body-l ${isDarkMode ? "text-backgroundLight-light" : "text-black-100"}`} // Adapting for dark mode
        >
          {i18n(
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
                i18n(
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
        {i18n("settings.batching.toggle")}
      </Toggle>
    </Screen>
  );
};

function TransactionBatchingHeader() {
  const setPopup = useSetPopup();
  const showHelpPopup = () => {
    setPopup(<HelpPopup id="transactionBatching" />);
  };

  return (
    <Header
      title={i18n("settings.transactionBatching")}
      icons={[{ ...headerIcons.help, onPress: showHelpPopup }]}
    />
  );
}
