import { MuSigFactory } from "@brandonblack/musig";
import { createCrypto } from "@brandonblack/musig/adapters/secp256k1";
import * as ecc from "@bitcoinerlab/secp256k1";

/** MuSig2 (BIP327) over the same secp256k1 backend the rest of the wallet
 * uses. Pure JS — no WASM, so it runs under Hermes. */
export const musig = MuSigFactory(createCrypto(ecc));
