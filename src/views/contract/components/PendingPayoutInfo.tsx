import { TouchableOpacity, View } from "react-native";
import { Icon } from "../../../components/Icon";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { AddressSummaryItem } from "../../../components/summaryItem/AddressSummaryItem";
import { SummaryItem } from "../../../components/summaryItem/SummaryItem";
import { PeachText } from "../../../components/text/PeachText";
import { SimpleTimer } from "../../../components/text/Timer";
import { MSINASECOND } from "../../../constants";
import { HelpPopup } from "../../../popups/HelpPopup";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { useContractContext } from "../context";

const NO_ENTRY_VALUE = -2;

export const PendingPayoutInfo = () => {
  console.log("here PAYOUT PENDING INFO");
  const { releaseAddress, batchInfo } = useContractContext().contract;
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="payoutPending" />);
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
        <SummaryItem title={i18n("batching.eta")}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-between gap-2`}
            onPress={showHelp}
          >
            <SimpleTimer
              end={Date.now() + timeRemaining * MSINASECOND}
              style={tw`subtitle-1`}
            />
            <Icon id="helpCircle" color={tw.color("info-main")} size={16} />
          </TouchableOpacity>
        </SummaryItem>
      )}
    </View>
  );
};
