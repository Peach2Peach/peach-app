import { openURL } from "../web/openURL";

/** nigiri's Liquid esplora, per the regtest setup in LIQUID_ADD_INSTRUCTIONS */
const REGTEST_LIQUID_ESPLORA = "http://localhost:3001";

/** Liquid address explorer link, the counterpart of `showAddress`.
 * liquid.network is mempool's Liquid explorer. */
export const showLiquidAddress = (
  address: string,
  network: BitcoinNetwork,
) => {
  let link = `https://liquid.network/address/${address}`;

  if (network === "testnet")
    link = `https://liquid.network/testnet/address/${address}`;
  if (network === "regtest")
    link = `${REGTEST_LIQUID_ESPLORA}/address/${address}`;

  return openURL(link);
};
