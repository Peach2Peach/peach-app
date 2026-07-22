import { Transaction, address } from "bitcoinjs-lib";
import { getNetwork } from "../../../utils/wallet/getNetwork";

export function getOutputValuesByAddress(outs: Transaction["outs"] = []) {
  return outs.reduce<Record<string, number>>((values, out) => {
    try {
      const outputAddress = address.fromOutputScript(out.script, getNetwork());
      values[outputAddress] = (values[outputAddress] || 0) + out.value;
    } catch {
      // output script is not a standard address, it has no amount to attribute
    }
    return values;
  }, {});
}
