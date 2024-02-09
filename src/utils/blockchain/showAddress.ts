import { showBitcoinAddress } from "../bitcoin/showBitcoinAddress";
import { showLiquidAddress } from "../liquid/showLiquidAddress";
import { getLiquidNetwork } from "../wallet/getLiquidNetwork";
import { getNetwork } from "../wallet/getNetwork";

export const showAddress = (txId: string, network: 'bitcoin' | 'liquid') => 
  network === 'bitcoin'
  ? showBitcoinAddress(txId, getNetwork())
  : showLiquidAddress(txId, getLiquidNetwork())
