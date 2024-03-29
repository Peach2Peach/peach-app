import { Psbt } from "bitcoinjs-lib";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { SIGHASH } from "../bitcoin/constants";
import { getEscrowWalletForOffer } from "../wallet/getEscrowWalletForOffer";
import { setWallet } from "../wallet/setWallet";
import { signBatchReleaseTransaction } from "./signBatchReleaseTransaction";

jest.mock("../../views/contract/helpers/verifyReleasePSBT");
const verifyReleasePSBTMock = jest.requireMock(
  "../../views/contract/helpers/verifyReleasePSBT",
).verifyReleasePSBT;

describe("signBatchReleaseTransaction", () => {
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
  const finalizeInputMock = jest.fn();

  const batchPsbt: Partial<Psbt> = {
    data: {
      inputs: [{ sighashType: SIGHASH.SINGLE_ANYONECANPAY }],
    } as Psbt["data"],
    signInput: jest.fn().mockReturnValue({ finalizeInput: finalizeInputMock }),
    toBase64: jest.fn().mockReturnValue("batchTransactionAsBase64"),
    txInputs: [{}] as Psbt["txInputs"],
    txOutputs: [{ address: "address1", value: 9000 }] as Psbt["txOutputs"],
  };
  setWallet(createTestWallet());

  const wallet = getEscrowWalletForOffer(mockSellOffer as SellOffer);

  it("should sign batch release transaction", () => {
    verifyReleasePSBTMock.mockReturnValueOnce(null);
    const base64 = signBatchReleaseTransaction({
      psbt: batchPsbt as Psbt,
      contract: contractWithBatching as Contract,
      sellOffer: mockSellOffer as SellOffer,
      wallet,
    });

    expect(base64).toEqual("batchTransactionAsBase64");
    expect(batchPsbt.signInput).toHaveBeenCalled();
  });
});
