import ecc from "@bitcoinerlab/secp256k1";
import BIP32Factory from "bip32";
import * as bip39 from "bip39";
import { Network } from "bitcoinjs-lib";
import { getRandom } from "../crypto/getRandom";
const bip32 = BIP32Factory(ecc);

const ENTROPY_BYTES = 16;

/**
 * @deprecated
 */
export const createRandomWallet = async (network: Network) => {
  const mnemonic = bip39.entropyToMnemonic(await getRandom(ENTROPY_BYTES));
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  return {
    wallet: bip32.fromSeed(seed, network),
    mnemonic,
  };
};
