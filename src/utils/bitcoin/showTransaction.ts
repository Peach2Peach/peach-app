import { ESPLORA_URL } from "@env";
import { openURL } from "../web/openURL";

export const showTransaction = (txId: string, network: BitcoinNetwork) => {
  let link = `https://mempool.space/tx/${txId}`;

  if (network === "testnet") link = `https://mempool.space/testnet/tx/${txId}`;
  if (network === "regtest") link = `${ESPLORA_URL}/tx/${txId}`;

  return openURL(link);
};
