import { ESPLORA_URL } from "@env";
import { Network, networks } from "bitcoinjs-lib";
import { openURL } from "../web/openURL";

export const showBitcoinTransaction = (txId: string, network: Network) => {
  let link = `https://mempool.space/tx/${txId}`;

  if (network === networks.testnet)
    link = `https://mempool.space/testnet/tx/${txId}`;
  if (network === networks.regtest) link = `${ESPLORA_URL}/tx/${txId}`;

  return openURL(link);
};
