import { showBitcoinTransaction } from "../bitcoin/showBitcoinTransaction";
import { showLiquidTransaction } from "../liquid/showLiquidTransaction";
import { getLiquidNetwork } from "../wallet/getLiquidNetwork";
import { getNetwork } from "../wallet/getNetwork";

export const showTransaction = (txId: string, chain: Chain) =>
  chain === "bitcoin"
    ? showBitcoinTransaction(txId, getNetwork())
    : showLiquidTransaction(txId, getLiquidNetwork());
