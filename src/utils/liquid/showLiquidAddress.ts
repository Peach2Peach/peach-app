import { ESPLORA_URL } from "@env";
import { networks } from "liquidjs-lib";
import { openURL } from "../web/openURL";

export const showLiquidAddress = (address: string, network: networks.Network) => {
  let link = `https://liquid.network/address/${address}`;

  if (network === networks.testnet) link = `https://liquid.network/testnet/address/${address}`;
  if (network === networks.regtest) link = `${ESPLORA_URL}/address/${address}`;
  return openURL(link);
};
