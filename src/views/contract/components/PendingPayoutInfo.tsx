import { View } from "react-native";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import {
  AddressSummaryItem,
  TextSummaryItem,
  TimerSummaryItem,
} from "../../../components/summaryItem";
import { MSINASECOND } from "../../../constants";
import { HelpPopup } from "../../../popups/HelpPopup";
import tw from "../../../styles/tailwind";
import { useContractContext } from "../context";
import { useTranslate } from "@tolgee/react";

const NO_ENTRY_VALUE = -2;

export const PendingPayoutInfo = () => {
  const { releaseAddress, batchInfo } = useContractContext().contract;
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="payoutPending" />);
  const { t } = useTranslate("batching");
  const etaProps = {
    title: t("batching.eta"),
    iconId: "helpCircle" as const,
    iconColor: tw.color("info-main"),
    onPress: showHelp,
  };
  if (!batchInfo) return <></>;
  const { timeRemaining, participants, maxParticipants } = batchInfo;
  return (
    <View style={tw`justify-center gap-4 grow`}>
      <AddressSummaryItem
        title={t("batching.willBeSentTo")}
        address={releaseAddress}
      />
      {timeRemaining === NO_ENTRY_VALUE ? (
        <TextSummaryItem text={t("batching.eta.tba")} {...etaProps} />
      ) : (
        <TimerSummaryItem
          {...etaProps}
          end={Date.now() + timeRemaining * MSINASECOND}
        />
      )}
      <TextSummaryItem
        title={t("batching.slots")}
        text={`${participants}/${maxParticipants}`}
      />
    </View>
  );
};
