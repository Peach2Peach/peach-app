import { openURL } from "../web/openURL";

/** nigiri's Liquid esplora, per the regtest setup in LIQUID_ADD_INSTRUCTIONS */
const REGTEST_LIQUID_ESPLORA = "http://localhost:3001";

/** Liquid block explorer link. The Liquid counterpart of `showTransaction`'s
 * mempool.space — liquid.network is mempool's Liquid explorer. */
export const showLiquidTransaction = (
  txId: string,
  network: BitcoinNetwork,
) => {
  let link = `https://liquid.network/tx/${txId}`;

  if (network === "testnet")
    link = `https://liquid.network/testnet/tx/${txId}`;
  if (network === "regtest") link = `${REGTEST_LIQUID_ESPLORA}/tx/${txId}`;

  return openURL(link);
};
