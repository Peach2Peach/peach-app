import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { TouchableOpacity } from "react-native";
import { Icon } from "../../../../components/Icon";
import { useSetPopup } from "../../../../components/popup/GlobalPopup";
import { SummaryItem } from "../../../../components/summaryItem/SummaryItem";
import { PeachText } from "../../../../components/text/PeachText";
import { useFeeEstimates } from "../../../../hooks/query/useFeeEstimates";
import { HelpPopup } from "../../../../popups/HelpPopup";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { keys } from "../../../../utils/object/keys";
import { useTxFeeRate } from "../../hooks/useTxFeeRate";

type Props = {
  transaction: TransactionDetails;
};
export const TransactionETASummaryItem = ({ transaction }: Props) => {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="confirmationTime" />);
  const { data: currentFeeRate } = useTxFeeRate({ transaction });
  const { feeEstimates } = useFeeEstimates();
  const etaInBlocks = getETAInBlocks(currentFeeRate, feeEstimates);

  return (
    <SummaryItem title={i18n("time")}>
      <TouchableOpacity
        style={tw`flex-row items-center justify-between gap-2`}
        onPress={showHelp}
      >
        <PeachText style={tw`subtitle-1`}>
          {i18n(
            `transaction.eta.${etaInBlocks === 1 ? "in1Block" : "inXBlocks"}`,
            String(etaInBlocks),
          )}
        </PeachText>
        <Icon id={"helpCircle"} color={tw.color("info-main")} size={16} />
      </TouchableOpacity>
    </SummaryItem>
  );
};

function getETAInBlocks(feeRate: number, feeEstimates: ConfirmationTargets) {
  return Number(
    keys(feeEstimates).find((eta) => feeRate > feeEstimates[eta]) || "1008",
  );
}
