import { ESPLORA_URL } from "@env";
import { openURL } from "../web/openURL";

export const showLiquidAddress = (address: string, network: BitcoinNetwork) => {
  let link = `https://liquid.network/address/${address}`;

  if (network === "testnet")
    link = `https://liquid.network/testnet/address/${address}`;
  if (network === "regtest") link = `${ESPLORA_URL}/address/${address}`;
  return openURL(link);
};
