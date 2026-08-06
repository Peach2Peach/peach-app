import { KeyGenContext } from "@brandonblack/musig";
import { Network, address, crypto, opcodes, script } from "bitcoinjs-lib";
import varuint from "varuint-bitcoin";
import { musig } from "../../musig/musig";
import { getNetwork } from "../getNetwork";

const LEAF_VERSION_TAPSCRIPT = 0xc0;
const TAPROOT_WITNESS_VERSION = 1;
const XONLY_PUBKEY_BYTES = 32;

export const toXOnly = (publicKey: Uint8Array) =>
  Buffer.from(
    publicKey.length === XONLY_PUBKEY_BYTES ? publicKey : publicKey.subarray(1),
  );

/**
 * the single tapscript leaf of the escrow: after `expiry` relative blocks
 * Peach alone can sweep the escrow back to the seller
 */
export const getRefundLeafScript = (
  peachPublicKey: Uint8Array,
  expiry: number,
) =>
  script.compile([
    script.number.encode(expiry),
    opcodes.OP_CHECKSEQUENCEVERIFY,
    opcodes.OP_DROP,
    toXOnly(peachPublicKey),
    opcodes.OP_CHECKSIG,
  ]);

const serializeScript = (leafScript: Buffer) => {
  const varintLen = varuint.encodingLength(leafScript.length);
  const buffer = Buffer.allocUnsafe(varintLen);
  varuint.encode(leafScript.length, buffer);
  return Buffer.concat([buffer, leafScript]);
};

const tapLeafHash = (leafScript: Buffer) =>
  crypto.taggedHash(
    "TapLeaf",
    Buffer.concat([
      Buffer.from([LEAF_VERSION_TAPSCRIPT]),
      serializeScript(leafScript),
    ]),
  );

export type TaprootEscrow = {
  /** BIP327 sorted list of the two 33 byte compressed escrow public keys */
  publicKeys: Buffer[];
  /** MuSig2 aggregate of the two public keys, 32 byte x-only */
  internalKey: Buffer;
  leafScript: Buffer;
  merkleRoot: Buffer;
  /** BIP341 taptweak, applied to the key aggregation as an x-only tweak */
  tweak: Buffer;
  /** the taproot output key, 32 byte x-only */
  outputKey: Buffer;
  /** the tweaked key aggregation context, used for signing */
  keyGenContext: KeyGenContext;
  /** scriptPubKey of the escrow output */
  script: Buffer;
  address: string;
};

/**
 * @description derives the MuSig2 taproot (escrow version 2) escrow:
 * P2TR(
 *   internalKey = MuSig2-aggregate(KeySort([sellerPubKey, peachPubKey])),
 *   scriptTree  = [<expiry> OP_CSV OP_DROP <peachXOnly> OP_CHECKSIG]
 * )
 *
 * The derived address MUST equal the escrow address returned by the server,
 * verify it before funding and before signing a release
 */
export function deriveTaprootEscrow({
  sellerPublicKey,
  peachPublicKey,
  expiry,
  network = getNetwork(),
}: {
  /** the seller's 33 byte compressed escrow public key */
  sellerPublicKey: Uint8Array;
  /** Peach's 33 byte compressed escrow public key */
  peachPublicKey: Uint8Array;
  /** the relative timelock of the refund tapleaf in blocks */
  expiry: number;
  network?: Network;
}): TaprootEscrow {
  const publicKeys = musig
    .keySort([
      Uint8Array.from(sellerPublicKey),
      Uint8Array.from(peachPublicKey),
    ])
    .map((key) => Buffer.from(key));

  const internalKey = Buffer.from(
    musig.getXOnlyPubkey(musig.keyAgg(publicKeys)),
  );

  const leafScript = getRefundLeafScript(peachPublicKey, expiry);
  const merkleRoot = tapLeafHash(leafScript);
  const tweak = crypto.taggedHash(
    "TapTweak",
    Buffer.concat([internalKey, merkleRoot]),
  );

  const keyGenContext = musig.keyAgg(publicKeys, { tweak, xOnly: true });
  const outputKey = Buffer.from(musig.getXOnlyPubkey(keyGenContext));

  return {
    publicKeys,
    internalKey,
    leafScript,
    merkleRoot,
    tweak,
    outputKey,
    keyGenContext,
    script: script.compile([opcodes.OP_1, outputKey]),
    address: address.toBech32(
      outputKey,
      TAPROOT_WITNESS_VERSION,
      network.bech32,
    ),
  };
}
