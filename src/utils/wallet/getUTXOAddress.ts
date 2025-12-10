import { Address, LocalUtxo, Network } from "bdk-rn";

export const getUTXOAddress = (network: Network) => async (utxo: LocalUtxo) => {
  const address = Address.fromScript(utxo.txout.script, network);
  return address.toQrUri();
};
