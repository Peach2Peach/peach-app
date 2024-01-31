import { Address } from "bdk-rn";
import { LocalUtxo } from "bdk-rn/lib/classes/Bindings";
import { Network } from "bdk-rn/lib/lib/enums";

export const getUTXOAddress = (network: Network) => async (utxo: LocalUtxo) =>
  (await new Address().fromScript(utxo.txout.script, network)).asString();
