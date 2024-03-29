import { Psbt, networks } from "bitcoinjs-lib";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { SIGHASH } from "../bitcoin/constants";
import { setWallet } from "../wallet/setWallet";
import { signReleaseTxOfContract } from "./signReleaseTxOfContract";

jest.mock("bitcoinjs-lib", () => ({
  ...jest.requireActual("bitcoinjs-lib"),
  Psbt: {
    fromBase64: jest.fn(),
  },
}));
const fromBase64Mock = jest.requireMock("bitcoinjs-lib").Psbt.fromBase64;

jest.mock("../../views/contract/helpers/verifyReleasePSBT");
const verifyReleasePSBTMock = jest.requireMock(
  "../../views/contract/helpers/verifyReleasePSBT",
).verifyReleasePSBT;

const amount = 10000;
const mockSellOffer = {
  id: "12",
  funding: { txIds: ["txid1"], vouts: [0], amounts: [amount] },
  amount,
};
const mockContract: Partial<Contract> = {
  id: "12-13",
  symmetricKeyEncrypted: "mockSymmetricKeyEncrypted",
  symmetricKeySignature: "mockSymmetricKeySignature",
  buyer: { id: "mockBuyerId", pgpPublicKey: "mockPgpPublicKey" } as User,
  seller: { id: "mockSellerId" } as User,
  releasePsbt: "releasePsbt",
};
const contractWithBatching = {
  ...mockContract,
  batchReleasePsbt: "batchReleasePsbt",
};

jest.mock("./getSellOfferFromContract");
const mockGetSellOfferFromContract = jest
  .requireMock("./getSellOfferFromContract")
  .getSellOfferFromContract.mockResolvedValue(mockSellOffer);

describe("signReleaseTxOfContract", () => {
  const finalizeInputMock = jest.fn();

  const psbt: Partial<Psbt> = {
    data: { inputs: [{ sighashType: SIGHASH.ALL }] } as Psbt["data"],
    signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
    extractTransaction: jest.fn().mockReturnValue({
      toHex: jest.fn().mockReturnValue("transactionAsHex"),
    }),
    txInputs: [{}] as Psbt["txInputs"],
    txOutputs: [
      { address: "address1", value: 9000 },
      { address: "address2", value: 1000 },
    ] as Psbt["txOutputs"],
  };
  const batchPsbt: Partial<Psbt> = {
    data: {
      inputs: [{ sighashType: SIGHASH.SINGLE_ANYONECANPAY }],
    } as Psbt["data"],
    signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
    toBase64: jest.fn().mockReturnValue("batchTransactionAsBase64"),
    txInputs: [{}] as Psbt["txInputs"],
    txOutputs: [{ address: "address1", value: 9000 }] as Psbt["txOutputs"],
  };
  fromBase64Mock.mockImplementation((base64: string | undefined) =>
    base64 === mockContract.releasePsbt ? psbt : batchPsbt,
  );
  setWallet(createTestWallet());

  it("should return null and error message if sell offer id is found", async () => {
    mockGetSellOfferFromContract.mockResolvedValueOnce(null);
    const { errorMsg } = await signReleaseTxOfContract(
      mockContract as Contract,
    );
    expect(errorMsg).toBe("SELL_OFFER_NOT_FOUND");
  });
  it("should return null and error message if sell offer funding is found", async () => {
    mockGetSellOfferFromContract.mockResolvedValueOnce({
      ...mockSellOffer,
      funding: undefined,
    });
    const { errorMsg } = await signReleaseTxOfContract(
      mockContract as Contract,
    );
    expect(errorMsg).toBe("SELL_OFFER_NOT_FOUND");
  });
  it("should return null and error message if psbt is not valid", async () => {
    verifyReleasePSBTMock.mockReturnValueOnce("INVALID_INPUT");
    const { releaseTransaction, batchReleasePsbt, errorMsg } =
      await signReleaseTxOfContract(mockContract as Contract);

    expect(releaseTransaction).toBe(undefined);
    expect(batchReleasePsbt).toBe(undefined);
    expect(errorMsg).toBe("INVALID_INPUT");
  });
  it("should sign valid release transaction and return it", async () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    const { releaseTransaction, batchReleasePsbt, errorMsg } =
      await signReleaseTxOfContract(mockContract as Contract);

    expect(errorMsg).toBe(undefined);
    expect(releaseTransaction).toEqual("transactionAsHex");
    expect(batchReleasePsbt).toEqual(undefined);
    expect(psbt.signInput).toHaveBeenCalled();
    expect(fromBase64Mock).toHaveBeenCalledWith(mockContract.releasePsbt, {
      network: networks.regtest,
    });
    expect(finalizeInputMock).toHaveBeenCalled();
    expect(psbt.extractTransaction).toHaveBeenCalled();
    expect(psbt.extractTransaction?.().toHex).toHaveBeenCalled();
  });
  it("should return null and error message if batch psbt is not valid", async () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    verifyReleasePSBTMock.mockReturnValueOnce("INVALID_INPUT");

    const { releaseTransaction, batchReleasePsbt, errorMsg } =
      await signReleaseTxOfContract(contractWithBatching as Contract);

    expect(releaseTransaction).toBe(undefined);
    expect(batchReleasePsbt).toBe(undefined);
    expect(errorMsg).toBe("INVALID_INPUT");
  });
  it("should return null and error message if batch psbt is valid but not for batching", async () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    fromBase64Mock.mockReturnValueOnce(psbt);
    fromBase64Mock.mockReturnValueOnce(psbt);

    const { releaseTransaction, batchReleasePsbt, errorMsg } =
      await signReleaseTxOfContract(contractWithBatching as Contract);

    expect(releaseTransaction).toBe(undefined);
    expect(batchReleasePsbt).toBe(undefined);
    expect(errorMsg).toBe("Transaction is not for batching");
  });
  it("should sign release transaction and batch release transaction", async () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    const { releaseTransaction, batchReleasePsbt, errorMsg } =
      await signReleaseTxOfContract(contractWithBatching as Contract);

    expect(errorMsg).toBe(undefined);
    expect(releaseTransaction).toEqual("transactionAsHex");
    expect(batchReleasePsbt).toEqual("batchTransactionAsBase64");
    expect(psbt.signInput).toHaveBeenCalled();
  });
});
