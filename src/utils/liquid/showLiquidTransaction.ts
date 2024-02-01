import { ESPLORA_URL } from "@env";
import { openURL } from "../web/openURL";

export const showLiquidTransaction = (
  txId: string,
  network: BitcoinNetwork,
) => {
  let link = `https://liquid.network/tx/${txId}`;

  if (network === "testnet") link = `https://liquid.network/testnet/tx/${txId}`;
  if (network === "regtest") link = `${ESPLORA_URL}/tx/${txId}`;

  return openURL(link);
};
