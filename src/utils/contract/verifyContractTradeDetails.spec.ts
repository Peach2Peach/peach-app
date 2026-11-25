import { NETWORK } from "@env";
import OpenPGP from "react-native-fast-openpgp";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { getInstantTradeDeclarationMessage } from "../account/getInstantTradeDeclarationMessage";
import { getMainAccount } from "../account/getMainAccount";
import { signMessageWithWallet } from "../account/signMessageWithWallet";
import { verifyContractTradeDetails } from "./verifyContractTradeDetails";

const mockFlag = { enabled: true };
jest.mock("./validateContractTradeDetailsFlag", () => ({
  get VALIDATE_CONTRACT_TRADE_DETAILS() {
    return mockFlag.enabled;
  },
}));
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
const buyerId = "02buyer";
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
  buyer: { id: buyerId, pgpPublicKeys: [{ publicKey: "buyerPgp" }] },
  seller: { id: sellerId, pgpPublicKeys: [{ publicKey: "sellerPgp" }] },
  encryptedTradeDetails: "encrypted",
  encryptedTradeDetailsBuyerSignature: "buyerSig",
  encryptedTradeDetailsSellerSignature: "sellerSig",
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
    mockFlag.enabled = true;
    jest.restoreAllMocks();
  });

  it("does nothing while the check is disabled", async () => {
    mockFlag.enabled = false;
    const decrypt = jest.spyOn(OpenPGP, "decrypt");
    await expect(
      verifyContractTradeDetails({
        contract: { ...contract, encryptedTradeDetails: undefined },
        sellOffer: { id: offerId, instantTradeSignature: null },
      }),
    ).resolves.toBeUndefined();
    expect(decrypt).not.toHaveBeenCalled();
  });

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
});
