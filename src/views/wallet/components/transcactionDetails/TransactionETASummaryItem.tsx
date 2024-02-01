import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { useSetPopup } from "../../../../components/popup/Popup";
import { TextSummaryItem } from "../../../../components/summaryItem";
import { HelpPopup } from "../../../../hooks/HelpPopup";
import { useFeeEstimates } from "../../../../hooks/query/useFeeEstimates";
import tw from "../../../../styles/tailwind";
import { getETAInBlocks } from "../../../../utils/electrum/getETAInBlocks";
import i18n from "../../../../utils/i18n";
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
