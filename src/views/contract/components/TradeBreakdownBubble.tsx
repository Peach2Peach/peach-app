import { Bubble } from "../../../components/bubble/Bubble";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { TradeBreakdownPopup } from "../../../popups/TradeBreakdownPopup";
import { useTranslate } from "@tolgee/react";

export function TradeBreakdownBubble({ contract }: { contract: Contract }) {
  const setPopup = useSetPopup();
  const { t } = useTranslate("contract");
  const showTradeBreakdown = () =>
    setPopup(<TradeBreakdownPopup contract={contract} />);

  return (
    <Bubble iconId="info" color="primary" onPress={showTradeBreakdown}>
      {t("contract.summary.tradeBreakdown.show")}
    </Bubble>
  );
}
