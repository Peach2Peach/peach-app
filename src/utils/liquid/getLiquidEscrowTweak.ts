import { sha256 } from "@noble/hashes/sha256";
import { opcodes, script } from "bitcoinjs-lib";
import * as varuint from "varuint-bitcoin";
import {
  LIQUID_LEAF_VERSION,
  TAP_LEAF_TAG,
  TAP_TWEAK_TAG,
} from "./constants";

/** BIP340-style tagged hash: sha256(sha256(tag) || sha256(tag) || msg...) */
export function taggedHash(tag: string, ...messages: Uint8Array[]) {
  const tagHash = sha256(new TextEncoder().encode(tag));
  const hash = sha256.create();
  hash.update(tagHash);
  hash.update(tagHash);
  for (const message of messages) hash.update(message);
  return hash.digest();
}

/**
 * The escrow's only script-path leaf: after `expiry` blocks, Peach alone can
 * sweep. Note there is no seller branch — the seller can only ever spend
 * cooperatively through the MuSig2 key path.
 *
 * `<expiry> OP_CHECKSEQUENCEVERIFY OP_DROP <peachXOnly> OP_CHECKSIG`
 */
export function getLiquidEscrowScript(
  peachXOnlyPublicKey: Uint8Array,
  expiry: number,
) {
  return script.compile([
    script.number.encode(expiry),
    opcodes.OP_CHECKSEQUENCEVERIFY,
    opcodes.OP_DROP,
    Buffer.from(peachXOnlyPublicKey),
    opcodes.OP_CHECKSIG,
  ]);
}

/** tagged_hash("TapLeaf/elements", version || compactSize(script) || script) */
export function getLiquidTapLeafHash(leafScript: Uint8Array) {
  return taggedHash(
    TAP_LEAF_TAG,
    Uint8Array.of(LIQUID_LEAF_VERSION),
    varuint.encode(leafScript.length),
    leafScript,
  );
}

/**
 * The taproot tweak that turns the MuSig2 aggregate key into the escrow's
 * output key. The same tweak has to be folded into the signing session, or the
 * aggregate signature will not verify against the funded output.
 *
 * The script tree has a single leaf, so the merkle root *is* the leaf hash.
 */
export function getLiquidEscrowTweak({
  aggregateXOnlyPublicKey,
  peachXOnlyPublicKey,
  expiry,
}: {
  aggregateXOnlyPublicKey: Uint8Array;
  peachXOnlyPublicKey: Uint8Array;
  expiry: number;
}) {
  const leafScript = getLiquidEscrowScript(peachXOnlyPublicKey, expiry);
  const merkleRoot = getLiquidTapLeafHash(leafScript);

  return taggedHash(TAP_TWEAK_TAG, aggregateXOnlyPublicKey, merkleRoot);
}
