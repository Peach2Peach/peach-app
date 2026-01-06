import { Address, LocalOutput, Network } from "bdk-rn";

export const getUTXOAddress = (network: Network) => (utxo: LocalOutput) => {
  const address = Address.fromScript(utxo.txout.scriptPubkey, network);

  const addressString = address.toQrUri().replace("bitcoin:", "").toLowerCase();
  return addressString;
};
