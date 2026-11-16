import ecc from "@bitcoinerlab/secp256k1";
import { crypto, payments } from "bitcoinjs-lib";
import { sign } from "bitcoinjs-message";
import { ECPairFactory } from "ecpair";
import { getMessageToSignForAddress } from "../account/getMessageToSignForAddress";
import { getNetwork } from "../wallet/getNetwork";
import {
  normalizeAddress,
  verifyBuyerReleaseAddress,
} from "./verifyBuyerReleaseAddress";

const ECPair = ECPairFactory(ecc);
const network = getNetwork();

const buyerKey = ECPair.makeRandom({ network });
const buyerId = buyerKey.publicKey.toString("hex");
const addressKey = ECPair.makeRandom({ network });
const releaseAddress = payments.p2wpkh({
  pubkey: addressKey.publicKey,
  network,
}).address as string;

const signFor = (address: string, peachKey = buyerKey) => {
  const message = getMessageToSignForAddress(buyerId, address);
  return {
    releaseAddressMessageSignature: sign(
      message,
      addressKey.privateKey as Buffer,
      addressKey.compressed,
      { segwitType: "p2wpkh" },
    ).toString("base64"),
    peachUserSignature: peachKey
      .sign(crypto.sha256(Buffer.from(message, "utf8")))
      .toString("hex"),
  };
};

describe("verifyBuyerReleaseAddress", () => {
  it("accepts valid signatures from both keys", () => {
    expect(() =>
      verifyBuyerReleaseAddress({
        buyerId,
        releaseAddress,
        ...signFor(releaseAddress),
      }),
    ).not.toThrow();
  });
  it("normalizes uppercase bech32 addresses", () => {
    expect(() =>
      verifyBuyerReleaseAddress({
        buyerId,
        releaseAddress: releaseAddress.toUpperCase(),
        ...signFor(releaseAddress),
      }),
    ).not.toThrow();
  });
  it("skips validation while a signature is missing", () => {
    const { releaseAddressMessageSignature, peachUserSignature } =
      signFor(releaseAddress);
    expect(() =>
      verifyBuyerReleaseAddress({
        buyerId,
        releaseAddress,
        releaseAddressMessageSignature,
      }),
    ).not.toThrow();
    expect(() =>
      verifyBuyerReleaseAddress({ buyerId, releaseAddress, peachUserSignature }),
    ).not.toThrow();
  });
  it("rejects a peach user signature from another key", () => {
    expect(() =>
      verifyBuyerReleaseAddress({
        buyerId,
        releaseAddress,
        ...signFor(releaseAddress, ECPair.makeRandom({ network })),
      }),
    ).toThrow("INVALID_RELEASE_ADDRESS_SIGNATURE");
  });
  it("rejects signatures made for a different address", () => {
    const otherAddress = payments.p2wpkh({
      pubkey: ECPair.makeRandom({ network }).publicKey,
      network,
    }).address as string;
    expect(() =>
      verifyBuyerReleaseAddress({
        buyerId,
        releaseAddress: otherAddress,
        ...signFor(releaseAddress),
      }),
    ).toThrow("INVALID_RELEASE_ADDRESS_SIGNATURE");
  });
  it("rejects malformed signatures", () => {
    expect(() =>
      verifyBuyerReleaseAddress({
        buyerId,
        releaseAddress,
        releaseAddressMessageSignature: "garbage",
        peachUserSignature: "zz",
      }),
    ).toThrow("INVALID_RELEASE_ADDRESS_SIGNATURE");
  });
});

describe("normalizeAddress", () => {
  it("lowercases bech32 and leaves base58 untouched", () => {
    expect(normalizeAddress(releaseAddress.toUpperCase())).toBe(releaseAddress);
    const legacy = payments.p2pkh({
      pubkey: buyerKey.publicKey,
      network,
    }).address as string;
    expect(normalizeAddress(legacy)).toBe(legacy);
  });
});
