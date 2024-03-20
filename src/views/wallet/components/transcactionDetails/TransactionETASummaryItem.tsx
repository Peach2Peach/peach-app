import { useTranslate } from "@tolgee/react";
import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { useSetPopup } from "../../../../components/popup/GlobalPopup";
import { TextSummaryItem } from "../../../../components/summaryItem";
import { useFeeEstimates } from "../../../../hooks/query/useFeeEstimates";
import { HelpPopup } from "../../../../popups/HelpPopup";
import tw from "../../../../styles/tailwind";
import { keys } from "../../../../utils/object/keys";
import { useTxFeeRate } from "../../hooks/useTxFeeRate";

type Props = {
  transaction: TransactionDetails;
};
export const TransactionETASummaryItem = ({ transaction }: Props) => {
  const setPopup = useSetPopup();
  const { t } = useTranslate("wallet");

  const showHelp = () => setPopup(<HelpPopup id="confirmationTime" />);
  const { data: currentFeeRate } = useTxFeeRate({ transaction });
  const { feeEstimates } = useFeeEstimates();
  const etaInBlocks = getETAInBlocks(currentFeeRate, feeEstimates);

  return (
    <TextSummaryItem
      title={t("time", { ns: "global" })}
      text={t(
        etaInBlocks === 1
          ? "transaction.eta.in1Block"
          : "transaction.eta.inXBlocks",
        { blocks: String(etaInBlocks) },
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
