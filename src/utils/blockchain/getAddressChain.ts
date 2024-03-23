import { isLiquidAddress } from "../validation/rules";
import { getLiquidNetwork } from "../wallet/getLiquidNetwork";

export const getAddressChain = (address?: string): Chain =>
  address && isLiquidAddress(address, getLiquidNetwork())
    ? "liquid"
    : "bitcoin";
