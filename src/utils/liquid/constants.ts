/** Minimum escrow size for a liquid sell offer. Kept above Boltz's chain-swap
 * floor (25 000 sats) so a funded escrow can always be swapped out to
 * mainchain. Enforced server-side too. */
export const LIQUID_MIN_AMOUNT = 30000;

/** Liquid taproot uses Elements-tagged hashes, not Bitcoin's. Getting these
 * wrong produces a valid-looking signature that the server rejects. */
export const TAP_LEAF_TAG = "TapLeaf/elements";
export const TAP_TWEAK_TAG = "TapTweak/elements";

/** Liquid tapleaf version, vs Bitcoin's 0xc0 */
export const LIQUID_LEAF_VERSION = 0xc4;

/** unconfidential Liquid HRPs, keyed by the app's bitcoin network name */
export const LIQUID_HRP: Record<string, string> = {
  bitcoin: "ex",
  testnet: "tex",
  regtest: "ert",
};

/** SLIP-44 coin type for L-BTC. Testnet and regtest use 1, like the rest of
 * the wallet. */
export const LIQUID_COIN_TYPE = 1776;
