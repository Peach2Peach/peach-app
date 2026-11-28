import { NETWORK } from "@env";
import ecc from "@bitcoinerlab/secp256k1";
import BIP32Factory from "bip32";
import { networks } from "bitcoinjs-lib";
import OpenPGP from "react-native-fast-openpgp";
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

// the seller's PGP key, with the seller's proof of owning it
const sellerPgpPublicKeys = [
  {
    publicKey: "sellerPgp",
    proof: signMessageWithWallet("sellerPgp", sellerWallet),
  },
];

/** the only valid PGP signature is "pgpSig" by sellerPgp over `signedMessage` */
const mockPGP = (signedMessage: string) =>
  jest
    .spyOn(OpenPGP, "verify")
    .mockImplementation(
      async (signature, message, publicKey) =>
        signature === "pgpSig" &&
        publicKey === "sellerPgp" &&
        message === signedMessage,
    );

describe("getInstantTradeFromDeclaration", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(OpenPGP, "verify").mockResolvedValue(false);
  });

  it("returns true for a signed 'is instant trade' declaration", async () => {
    await expect(
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        sellerPgpPublicKeys,
        instantTradeSignature: declare("52", true),
      }),
    ).resolves.toBe(true);
  });

  it("returns false for a signed 'is NOT instant trade' declaration", async () => {
    await expect(
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        sellerPgpPublicKeys,
        instantTradeSignature: declare("52", false),
      }),
    ).resolves.toBe(false);
  });

  it("throws when the declaration is for another offer", async () => {
    await expect(
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        sellerPgpPublicKeys,
        instantTradeSignature: declare("53", false),
      }),
    ).rejects.toThrow("INVALID_INSTANT_TRADE_DECLARATION");
  });

  it("throws when the declaration is signed by another key", async () => {
    await expect(
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        sellerPgpPublicKeys,
        instantTradeSignature: declare("52", true, otherWallet),
      }),
    ).rejects.toThrow("INVALID_INSTANT_TRADE_DECLARATION");
  });

  it.each([null, undefined, "", "abcd"])(
    "throws when the declaration is missing or garbage (%p)",
    async (instantTradeSignature) => {
      await expect(
        getInstantTradeFromDeclaration({
          offerId: "52",
          sellerId,
          sellerPgpPublicKeys,
          instantTradeSignature,
        }),
      ).rejects.toThrow("INVALID_INSTANT_TRADE_DECLARATION");
    },
  );

  it.each([true, false])(
    "accepts a PGP signed declaration (is instant trade: %s)",
    async (isInstantTrade) => {
      mockPGP(
        getInstantTradeDeclarationMessage(sellerId, "52", isInstantTrade),
      );
      await expect(
        getInstantTradeFromDeclaration({
          offerId: "52",
          sellerId,
          sellerPgpPublicKeys,
          instantTradeSignature: "pgpSig",
        }),
      ).resolves.toBe(isInstantTrade);
    },
  );

  it("throws when the PGP declaration is for another offer", async () => {
    mockPGP(getInstantTradeDeclarationMessage(sellerId, "53", true));
    await expect(
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        sellerPgpPublicKeys,
        instantTradeSignature: "pgpSig",
      }),
    ).rejects.toThrow("INVALID_INSTANT_TRADE_DECLARATION");
  });

  it("throws when the PGP declaration is signed by another key", async () => {
    mockPGP(getInstantTradeDeclarationMessage(sellerId, "52", true));
    await expect(
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        sellerPgpPublicKeys: [
          {
            publicKey: "otherPgp",
            proof: signMessageWithWallet("otherPgp", sellerWallet),
          },
        ],
        instantTradeSignature: "pgpSig",
      }),
    ).rejects.toThrow("INVALID_INSTANT_TRADE_DECLARATION");
  });

  it("does not check PGP keys for a valid Peach ID signature", async () => {
    const verify = jest.spyOn(OpenPGP, "verify");
    await getInstantTradeFromDeclaration({
      offerId: "52",
      sellerId,
      sellerPgpPublicKeys,
      instantTradeSignature: declare("52", true),
    });
    expect(verify).not.toHaveBeenCalled();
  });

  it("ignores a PGP key the seller did not prove owning", async () => {
    mockPGP(getInstantTradeDeclarationMessage(sellerId, "52", true));
    await expect(
      getInstantTradeFromDeclaration({
        offerId: "52",
        sellerId,
        // the key that made the signature, but with someone else's proof
        sellerPgpPublicKeys: [
          {
            publicKey: "sellerPgp",
            proof: signMessageWithWallet("sellerPgp", otherWallet),
          },
        ],
        instantTradeSignature: "pgpSig",
      }),
    ).rejects.toThrow("INVALID_INSTANT_TRADE_DECLARATION");
  });
});
