import { Contract } from "../../../../peach-api/src/@types/contract";
import { Bubble } from "../../../components/bubble/Bubble";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { TradeBreakdownPopup } from "../../../popups/TradeBreakdownPopup";
import i18n from "../../../utils/i18n";

export function TradeBreakdownBubble({ contract }: { contract: Contract }) {
  const setPopup = useSetPopup();
  const showTradeBreakdown = () =>
    setPopup(<TradeBreakdownPopup contract={contract} />);

  return (
    <Bubble iconId="info" color="primary" onPress={showTradeBreakdown}>
      {i18n("contract.summary.tradeBreakdown.show")}
    </Bubble>
  );
}
