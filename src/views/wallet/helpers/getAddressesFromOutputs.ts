import {
  Transaction as BitcoinTransaction,
  address as bitcoinAddress,
} from "bitcoinjs-lib";
import {
  Transaction as LiquidTransaction,
  address as liquidAddress,
} from "liquidjs-lib";
import { isDefined } from "../../../utils/validation/isDefined";
import { getLiquidNetwork } from "../../../utils/wallet/getLiquidNetwork";
import { getNetwork } from "../../../utils/wallet/getNetwork";

export const scriptToAddress = (script: Buffer, chain: string) => {
  try {
    return chain === "bitcoin"
      ? bitcoinAddress.fromOutputScript(script, getNetwork())
      : liquidAddress.fromOutputScript(script, getLiquidNetwork());
  } catch (e) {
    return undefined;
  }
};

export const getAddressesFromOutputs = ({
  outs,
  chain,
}: Pick<BitcoinTransaction | LiquidTransaction, "outs"> & { chain: Chain }) =>
  outs
    .map((v) => v.script)
    .filter((script) => script.byteLength > 1)
    .map((script) => scriptToAddress(script, chain))
    .filter(isDefined);
