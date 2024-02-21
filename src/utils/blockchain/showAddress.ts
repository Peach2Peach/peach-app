import { showBitcoinAddress } from "../bitcoin/showBitcoinAddress";
import { showLiquidAddress } from "../liquid/showLiquidAddress";
import { isLiquidAddress } from "../validation/rules";
import { getLiquidNetwork } from "../wallet/getLiquidNetwork";
import { getNetwork } from "../wallet/getNetwork";

export const showAddress = (address: string) =>
  isLiquidAddress(address, getLiquidNetwork())
    ? showLiquidAddress(address, getLiquidNetwork())
    : showBitcoinAddress(address, getNetwork());
