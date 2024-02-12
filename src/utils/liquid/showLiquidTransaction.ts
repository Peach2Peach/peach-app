import { ESPLORA_LIQUID_URL } from "@env";
import { networks } from "liquidjs-lib";
import { openURL } from "../web/openURL";

export const showLiquidTransaction = (
  txId: string,
  network: networks.Network,
) => {
  let link = `https://liquid.network/tx/${txId}`;

  if (network === networks.testnet) link = `https://liquid.network/testnet/tx/${txId}`;
  if (network === networks.regtest) link = `${ESPLORA_LIQUID_URL}/tx/${txId}`;

  return openURL(link);
};
