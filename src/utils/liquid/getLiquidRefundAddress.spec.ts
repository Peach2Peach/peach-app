import { bech32 } from "bech32";
import { BIP32Factory } from "bip32";
import * as ecc from "@bitcoinerlab/secp256k1";
import { mnemonicToSeedSync } from "bip39";
import {
  getLiquidRefundAddress,
  getLiquidRefundAddressPath,
} from "./getLiquidRefundAddress";
import { setWallet } from "../wallet/setWallet";

const SEED_PHRASE =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

const bip32 = BIP32Factory(ecc);

beforeAll(() => {
  setWallet(bip32.fromSeed(mnemonicToSeedSync(SEED_PHRASE)));
});

// .env.test runs on regtest, where Elements uses the `ert` HRP and coin type 1
describe("getLiquidRefundAddress", () => {
  it("derives the change keychain at index 0", () => {
    expect(getLiquidRefundAddressPath()).toBe("m/84'/1'/0'/1/0");
  });

  it("returns an unconfidential witness v0 address on the liquid HRP", () => {
    const address = getLiquidRefundAddress();

    expect(address.startsWith("ert1q")).toBeTruthy();

    const decoded = bech32.decode(address);
    expect(decoded.prefix).toBe("ert");
    // witness version 0 followed by a 20-byte hash160
    expect(decoded.words[0]).toBe(0);
    expect(bech32.fromWords(decoded.words.slice(1))).toHaveLength(20);
  });

  it("is stable for a given seed", () => {
    expect(getLiquidRefundAddress()).toBe(getLiquidRefundAddress());
  });
});
