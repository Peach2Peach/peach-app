import { Address, Network } from "bdk-rn";
import type { LocalOutput } from "bdk-rn";

export const getUTXOAddress = (network: Network) => (utxo: LocalOutput) =>
  Address.fromScript(utxo.txout.scriptPubkey, network).toString();
