import { BIP32Interface } from "bip32";
import {
  Psbt,
  Signer,
  address as addressUtils,
  crypto,
  payments,
} from "bitcoinjs-lib";
import { getNetwork } from "./getNetwork";

const X_ONLY_KEY_LENGTH = 32;
const COMPRESSED_KEY_LENGTH = 33;

/**
 * @description taproot keys are x-only: drop the compressed pubkey's parity
 * byte. `Buffer.from` is not redundant - on React Native `subarray` returns a
 * plain Uint8Array, which bitcoinjs' type checks reject.
 */
export const toXOnly = (publicKey: Buffer) =>
  publicKey.length === X_ONLY_KEY_LENGTH
    ? Buffer.from(publicKey)
    : Buffer.from(publicKey.subarray(1, COMPRESSED_KEY_LENGTH));

/**
 * @description escrowVersion 2 escrow: a plain BIP86 key-path-only taproot
 * output owned by the seller alone - no script tree, no merkle root, no Peach
 * key and no timelock. The address is a pure function of the seller's escrow
 * pubkey, which is why a fresh key has to be derived for every sell offer.
 */
export const getSingleSigEscrow = (publicKey: Buffer) =>
  payments.p2tr({
    internalPubkey: toXOnly(publicKey),
    network: getNetwork(),
  });

export const getSingleSigEscrowAddress = (publicKey: Buffer) => {
  const { address } = getSingleSigEscrow(publicKey);
  if (!address) throw Error("COULD_NOT_DERIVE_ESCROW_ADDRESS");
  return address;
};

export const getSingleSigEscrowScript = (publicKey: Buffer) => {
  const { output } = getSingleSigEscrow(publicKey);
  if (!output) throw Error("COULD_NOT_DERIVE_ESCROW_SCRIPT");
  return Buffer.from(output);
};

const TAPROOT_WITNESS_VERSION = 1;
const TAPROOT_PROGRAM_LENGTH = X_ONLY_KEY_LENGTH;
/**
 * @description whether an address is a P2TR one, i.e. an escrowVersion 2
 * escrow. Legacy escrows are P2WSH.
 */
export const isSingleSigEscrowAddress = (address: string) => {
  try {
    const { version, data } = addressUtils.fromBech32(address);
    return (
      version === TAPROOT_WITNESS_VERSION &&
      data.length === TAPROOT_PROGRAM_LENGTH
    );
  } catch {
    return false;
  }
};

/**
 * @description a key path spend is signed with the *tweaked* key, never with
 * the raw escrow key
 */
export const getTweakedEscrowSigner = (wallet: BIP32Interface): Signer =>
  wallet.tweak(crypto.taggedHash("TapTweak", toXOnly(wallet.publicKey)));

/**
 * @description signs a taproot key path input with SIGHASH_DEFAULT and returns
 * the resulting 64 byte BIP340 schnorr signature
 */
export const signSingleSigEscrowInput = (
  psbt: Psbt,
  inputIndex: number,
  wallet: BIP32Interface,
) => {
  psbt.signInput(inputIndex, getTweakedEscrowSigner(wallet));

  const { tapKeySig } = psbt.data.inputs[inputIndex];
  if (!tapKeySig) throw Error("signature missing");
  // SIGHASH_DEFAULT signatures carry no trailing sighash byte
  const SCHNORR_SIGNATURE_LENGTH = 64;
  if (tapKeySig.length !== SCHNORR_SIGNATURE_LENGTH) {
    throw Error("INVALID_SIGNATURE_LENGTH");
  }
  return Buffer.from(tapKeySig);
};
