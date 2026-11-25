import { NETWORK } from "@env";
import ecc from "@bitcoinerlab/secp256k1";
import BIP32Factory from "bip32";
import { networks } from "bitcoinjs-lib";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getInstantTradeDeclarationMessage } from "../account/getInstantTradeDeclarationMessage";
import { getMainAccount } from "../account/getMainAccount";
import { signMessageWithWallet } from "../account/signMessageWithWallet";
import { getInstantTradeFromDeclaration } from "./getInstantTradeFromDeclaration";

const sellerWallet = createTestWallet();
const sellerId = getMainAccount(sellerWallet, NETWORK).publicKey.toString(
  "hex",
);
// any other master key stands in for another user
const otherWallet = BIP32Factory(ecc).fromSeed(
  Buffer.alloc(32, 1),
  networks.regtest,
);

const declare = (
  offerId: string,
  isInstantTrade: boolean,
  wallet = sellerWallet,
) =>
  signMessageWithWallet(
    getInstantTradeDeclarationMessage(sellerId, offerId, isInstantTrade),
    wallet,
  );

describe("getInstantTradeFromDeclaration", () => {
  it("returns true for a signed 'is instant trade' declaration", () => {
    expect(
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        instantTradeSignature: declare("52", true),
      }),
    ).toBe(true);
  });

  it("returns false for a signed 'is NOT instant trade' declaration", () => {
    expect(
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        instantTradeSignature: declare("52", false),
      }),
    ).toBe(false);
  });

  it("throws when the declaration is for another offer", () => {
    expect(() =>
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        instantTradeSignature: declare("53", false),
      }),
    ).toThrow("INVALID_INSTANT_TRADE_DECLARATION");
  });

  it("throws when the declaration is signed by another key", () => {
    expect(() =>
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        instantTradeSignature: declare("52", true, otherWallet),
      }),
    ).toThrow("INVALID_INSTANT_TRADE_DECLARATION");
  });

  it("throws when the declaration is missing or garbage", () => {
    for (const instantTradeSignature of [null, undefined, "", "abcd"]) {
      expect(() =>
        getInstantTradeFromDeclaration({
          offerId: "52",
          sellerId,
          instantTradeSignature,
        }),
      ).toThrow("INVALID_INSTANT_TRADE_DECLARATION");
    }
  });
});
