import { View } from "react-native";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import {
  AddressSummaryItem,
  TimerSummaryItem,
} from "../../../components/summaryItem";
import { PeachText } from "../../../components/text/PeachText";
import { MSINASECOND } from "../../../constants";
import { HelpPopup } from "../../../popups/HelpPopup";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { useContractContext } from "../context";

const NO_ENTRY_VALUE = -2;

export const PendingPayoutInfo = () => {
  const { releaseAddress, batchInfo } = useContractContext().contract;
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="payoutPending" />);
  const etaProps = {
    title: i18n("batching.eta"),
    iconId: "helpCircle" as const,
    iconColor: tw.color("info-main"),
    onPress: showHelp,
  };
  if (!batchInfo) return <></>;
  const { timeRemaining } = batchInfo;
  return (
    <View style={tw`justify-center gap-4 grow`}>
      <PeachText style={tw`subtitle-1`}>
        {i18n("settings.batching.youSave")}
      </PeachText>
      <PeachText style={tw`subtitle-1`}>
        {i18n("batching.waitingForParticipants")}
      </PeachText>
      <AddressSummaryItem
        title={i18n("batching.willBeSentTo")}
        address={releaseAddress}
      />
      {timeRemaining !== NO_ENTRY_VALUE && (
        <TimerSummaryItem
          {...etaProps}
          end={Date.now() + timeRemaining * MSINASECOND}
        />
      )}
    </View>
  );
};
