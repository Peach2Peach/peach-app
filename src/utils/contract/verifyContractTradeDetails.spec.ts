import { NETWORK } from "@env";
import ecc from "@bitcoinerlab/secp256k1";
import BIP32Factory from "bip32";
import { networks } from "bitcoinjs-lib";
import OpenPGP from "react-native-fast-openpgp";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getInstantTradeDeclarationMessage } from "../account/getInstantTradeDeclarationMessage";
import { getMainAccount } from "../account/getMainAccount";
import { signMessageWithWallet } from "../account/signMessageWithWallet";
import { verifyContractTradeDetails } from "./verifyContractTradeDetails";

// the real account store pulls in immer's ESM build, which jest cannot parse
jest.mock("../account/account", () => ({
  useAccountStore: {
    getState: () => ({
      account: { pgp: { publicKey: "sellerPgp", privateKey: "sellerPrivate" } },
    }),
  },
}));
jest.mock("../peachAPI", () => ({ peachAPI: {} }));
jest.mock("../log/error");

const sellerWallet = createTestWallet();
const sellerId = getMainAccount(sellerWallet, NETWORK).publicKey.toString(
  "hex",
);
// any other master key stands in for the buyer
const buyerWallet = BIP32Factory(ecc).fromSeed(
  Buffer.alloc(32, 2),
  networks.regtest,
);
const buyerId = getMainAccount(buyerWallet, NETWORK).publicKey.toString("hex");
const offerId = "52";

const declaration = (isInstantTrade: boolean) =>
  signMessageWithWallet(
    getInstantTradeDeclarationMessage(sellerId, offerId, isInstantTrade),
    sellerWallet,
  );

const plaintext = JSON.stringify({
  buyer: buyerId,
  seller: sellerId,
  offerId: 52,
  paymentMethod: "wise",
  amount: "30000",
  price: 16.6,
  premium: 1.5,
  currency: "EUR",
});

const contract = {
  id: "52-7",
  amount: 30000,
  buyer: {
    id: buyerId,
    pgpPublicKeys: [
      {
        publicKey: "buyerPgp",
        proof: signMessageWithWallet("buyerPgp", buyerWallet),
      },
    ],
  },
  seller: {
    id: sellerId,
    pgpPublicKeys: [
      {
        publicKey: "sellerPgp",
        proof: signMessageWithWallet("sellerPgp", sellerWallet),
      },
    ],
  },
  encryptedTradeDetails: "encrypted",
  encryptedTradeDetailsBuyerSignature: "buyerSig",
  encryptedTradeDetailsSellerSignature: "sellerSig",
  validateEncryptedTradeDetails: true,
} as Parameters<typeof verifyContractTradeDetails>[0]["contract"];

const notInstantOffer = {
  id: offerId,
  instantTradeSignature: declaration(false),
};

/** valid signatures are exactly: buyerSig by buyerPgp, sellerSig by sellerPgp */
const mockPGP = (decrypted = plaintext) => {
  jest.spyOn(OpenPGP, "decrypt").mockResolvedValue(decrypted);
  jest
    .spyOn(OpenPGP, "verify")
    .mockImplementation(
      async (signature, _message, publicKey) =>
        (signature === "buyerSig" && publicKey === "buyerPgp") ||
        (signature === "sellerSig" && publicKey === "sellerPgp"),
    );
};

describe("verifyContractTradeDetails", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it.each([false, undefined])(
    "does nothing when the server sets validateEncryptedTradeDetails to %s",
    async (validateEncryptedTradeDetails) => {
      const decrypt = jest.spyOn(OpenPGP, "decrypt");
      await expect(
        verifyContractTradeDetails({
          contract: {
            ...contract,
            validateEncryptedTradeDetails,
            encryptedTradeDetails: undefined,
          },
          sellOffer: { id: offerId, instantTradeSignature: null },
        }),
      ).resolves.toBeUndefined();
      expect(decrypt).not.toHaveBeenCalled();
    },
  );

  it("skips instant trades, which carry no trade details", async () => {
    const decrypt = jest.spyOn(OpenPGP, "decrypt");
    await expect(
      verifyContractTradeDetails({
        contract: { ...contract, encryptedTradeDetails: undefined },
        sellOffer: { id: offerId, instantTradeSignature: declaration(true) },
      }),
    ).resolves.toBeUndefined();
    expect(decrypt).not.toHaveBeenCalled();
  });

  it("passes for valid trade details naming this buyer", async () => {
    mockPGP();
    await expect(
      verifyContractTradeDetails({ contract, sellOffer: notInstantOffer }),
    ).resolves.toBeUndefined();
  });

  it("fails when the instant trade declaration is invalid", async () => {
    await expect(
      verifyContractTradeDetails({
        contract,
        sellOffer: { id: offerId, instantTradeSignature: null },
      }),
    ).rejects.toThrow("INVALID_INSTANT_TRADE_DECLARATION");
  });

  it("fails when the trade details name another buyer", async () => {
    mockPGP(JSON.stringify({ ...JSON.parse(plaintext), buyer: "02other" }));
    await expect(
      verifyContractTradeDetails({ contract, sellOffer: notInstantOffer }),
    ).rejects.toThrow("INVALID_CONTRACT_TRADE_DETAILS");
  });

  it("fails when the trade details are for another offer", async () => {
    mockPGP(JSON.stringify({ ...JSON.parse(plaintext), offerId: 53 }));
    await expect(
      verifyContractTradeDetails({ contract, sellOffer: notInstantOffer }),
    ).rejects.toThrow("INVALID_CONTRACT_TRADE_DETAILS");
  });

  it("fails when the amount differs from the contract", async () => {
    mockPGP();
    await expect(
      verifyContractTradeDetails({
        contract: { ...contract, amount: 31000 },
        sellOffer: notInstantOffer,
      }),
    ).rejects.toThrow("INVALID_CONTRACT_TRADE_DETAILS");
  });

  it("fails when the contract is for another sell offer", async () => {
    mockPGP();
    await expect(
      verifyContractTradeDetails({
        contract: { ...contract, id: "53-7" },
        sellOffer: notInstantOffer,
      }),
    ).rejects.toThrow("INVALID_CONTRACT_TRADE_DETAILS");
  });

  it("fails on an invalid buyer signature", async () => {
    mockPGP();
    await expect(
      verifyContractTradeDetails({
        contract: { ...contract, encryptedTradeDetailsBuyerSignature: "bad" },
        sellOffer: notInstantOffer,
      }),
    ).rejects.toThrow("INVALID_CONTRACT_TRADE_DETAILS");
  });

  it("fails on an invalid seller signature", async () => {
    mockPGP();
    await expect(
      verifyContractTradeDetails({
        contract: { ...contract, encryptedTradeDetailsSellerSignature: "bad" },
        sellOffer: notInstantOffer,
      }),
    ).rejects.toThrow("INVALID_CONTRACT_TRADE_DETAILS");
  });

  it("fails when the trade details are missing", async () => {
    await expect(
      verifyContractTradeDetails({
        contract: { ...contract, encryptedTradeDetails: undefined },
        sellOffer: notInstantOffer,
      }),
    ).rejects.toThrow("INVALID_CONTRACT_TRADE_DETAILS");
  });

  it.each(["buyer", "seller"] as const)(
    "fails when the %s's PGP key has no valid ownership proof",
    async (party) => {
      mockPGP();
      await expect(
        verifyContractTradeDetails({
          contract: {
            ...contract,
            [party]: {
              ...contract[party],
              pgpPublicKeys: [
                { ...contract[party].pgpPublicKeys[0], proof: "abcd" },
              ],
            },
          },
          sellOffer: notInstantOffer,
        }),
      ).rejects.toThrow("INVALID_CONTRACT_TRADE_DETAILS");
    },
  );
});
