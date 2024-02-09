import { ContractSummary } from "../../../../../peach-api/src/@types/contract";
import { Bubble } from "../../../../components/bubble/Bubble";
import { useTradeNavigation } from "../../../../hooks/useTradeNavigation";
import { contractIdToHex } from "../../../../utils/contract/contractIdToHex";

type Props = {
  trade: ContractSummary;
};

export const TradeIdBubble = ({ trade }: Props) => {
  const goToContract = useTradeNavigation(trade);
  const tradeId = contractIdToHex(trade.id);

  return (
    <Bubble color="primary-mild" iconId="info" onPress={goToContract}>
      {tradeId}
    </Bubble>
  );
};
