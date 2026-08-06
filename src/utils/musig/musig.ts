import { MuSigFactory } from "@brandonblack/musig";
import { createCrypto } from "@brandonblack/musig/adapters/secp256k1";
import ecc from "@bitcoinerlab/secp256k1";

/** BIP327 MuSig2, as used by the taproot (escrow version 2) escrow */
export const musig = MuSigFactory(createCrypto(ecc));
