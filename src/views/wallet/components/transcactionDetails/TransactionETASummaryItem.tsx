import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { Transaction } from "../../../../../peach-api/src/@types/electrs-liquid";
import { useSetPopup } from "../../../../components/popup/GlobalPopup";
import { TextSummaryItem } from "../../../../components/summaryItem";
import { useFeeEstimates } from "../../../../hooks/query/useFeeEstimates";
import { HelpPopup } from "../../../../popups/HelpPopup";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { keys } from "../../../../utils/object/keys";
import { useTxFeeRate } from "../../hooks/useTxFeeRate";

type Props = {
  transaction: TransactionDetails | Transaction;
};
export const TransactionETASummaryItem = ({ transaction }: Props) => {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="confirmationTime" />);
  const { data: currentFeeRate } = useTxFeeRate({ transaction });
  const { feeEstimates } = useFeeEstimates();
  const etaInBlocks = getETAInBlocks(currentFeeRate, feeEstimates);

  return (
    <TextSummaryItem
      title={i18n("time")}
      text={i18n(
        `transaction.eta.${etaInBlocks === 1 ? "in1Block" : "inXBlocks"}`,
        String(etaInBlocks),
      )}
      iconId="helpCircle"
      iconColor={tw.color("info-main")}
      onPress={showHelp}
    />
  );
};

function getETAInBlocks(feeRate: number, feeEstimates: ConfirmationTargets) {
  return Number(
    keys(feeEstimates).find((eta) => feeRate > feeEstimates[eta]) || "1008",
  );
}
