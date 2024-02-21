import { ESPLORA_URL } from "@env";
import { Network, networks } from "bitcoinjs-lib";
import { openURL } from "../web/openURL";

export const showBitcoinAddress = (address: string, network: Network) => {
  let link = `https://mempool.space/address/${address}`;

  if (network === networks.testnet)
    link = `https://mempool.space/testnet/address/${address}`;
  if (network === networks.regtest) link = `${ESPLORA_URL}/address/${address}`;
  return openURL(link);
};
