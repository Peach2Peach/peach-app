import { useContractContext } from "../context";
import { shouldShowTradeStatusInfo } from "../helpers/shouldShowTradeStatusInfo";
import { TradeDetails } from "./TradeDetails";
import { TradeStatusInfo } from "./TradeStatusInfo";

export const TradeInformation = () => {
  const { contract, view } = useContractContext();
  return shouldShowTradeStatusInfo(contract, view) ? (
    <TradeStatusInfo />
  ) : (
    <TradeDetails />
  );
};
