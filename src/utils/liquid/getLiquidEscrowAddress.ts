import { NETWORK } from "@env";
import { bech32m } from "bech32";
import { LIQUID_HRP } from "./constants";

const SEGWIT_V1 = 1;
const BECH32M_LIMIT = 1000;

/**
 * The escrow's P2TR address: witness v1, the tweaked MuSig2 output key as the
 * program, bech32m-encoded under the Liquid HRP. Unconfidential — funding a
 * confidential address would hide the value from the escrow's chain watcher.
 */
export function getLiquidEscrowAddress(tweakedOutputKey: Uint8Array) {
  const hrp = LIQUID_HRP[NETWORK] ?? LIQUID_HRP.bitcoin;
  const words = [SEGWIT_V1, ...bech32m.toWords(tweakedOutputKey)];

  return bech32m.encode(hrp, words, BECH32M_LIMIT);
}
