import { responseUtils } from "test-utils";
import { contract } from "../../../peach-api/src/testData/contract";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { MSINADAY } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";
import { cancelContractAsSeller } from "./cancelContractAsSeller";

jest.useFakeTimers();
const cancelContractSuccessWithPSBT = { success: true as const, psbt: "psbt" };
const cancelContractMock = jest.spyOn(
  peachAPI.private.contract,
  "cancelContract",
);
const patchOfferMock = jest.spyOn(peachAPI.private.offer, "patchOffer");

jest.mock("../../utils/contract/getSellOfferFromContract", () => ({
  getSellOfferFromContract: jest.fn().mockReturnValue(sellOffer),
}));

jest.mock("../../utils/wallet/signPSBT", () => ({
  signPSBT: jest.fn().mockReturnValue({ toBase64: () => "psbt" }),
}));

jest.mock("../../utils/wallet/getEscrowWalletForOffer", () => ({
  getEscrowWalletForOffer: jest.fn().mockReturnValue({}),
}));

jest.mock("../../utils/bitcoin/checkRefundPSBT", () => ({
  checkRefundPSBT: jest.fn().mockReturnValue({
    isValid: true,
    psbt: {
      toBase64: () => "psbt",
    },
  }),
}));

describe("cancelContractAsSeller", () => {
  const yesterday = new Date(Date.now() - MSINADAY);
  const tomorrow = new Date(Date.now() + MSINADAY);
  const expiredContract = { ...contract, paymentExpectedBy: yesterday };
  it("calls cancelContract with active payment timer", async () => {
    const activeContract = { ...contract, paymentExpectedBy: tomorrow };
    const result = await cancelContractAsSeller(activeContract);
    expect(cancelContractMock).toHaveBeenCalledWith({
      contractId: contract.id,
    });
    expect(result.result).toBeTruthy();
    expect(result.result).toEqual({ sellOffer: undefined });
  });
  it("calls cancelContract with expired payment timer and returns contract update", async () => {
    const result = await cancelContractAsSeller(expiredContract);
    expect(cancelContractMock).toHaveBeenCalledWith({
      contractId: contract.id,
    });
    expect(result.result).toBeTruthy();
    expect(result.result).toEqual({ sellOffer: undefined });
  });
  it("calls cancelContract", async () => {
    const result = await cancelContractAsSeller(expiredContract);
    expect(cancelContractMock).toHaveBeenCalledWith({
      contractId: contract.id,
    });
    expect(result.result).toBeTruthy();
    expect(result.result).toEqual({ sellOffer: undefined });
  });
  it("handles cancelContract error response", async () => {
    cancelContractMock.mockResolvedValueOnce({
      result: undefined,
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const result = await cancelContractAsSeller(contract);
    expect(result.error).toBeTruthy();
    expect(result.result).toEqual({ sellOffer: undefined });
  });
  it("also calls patchSellOfferWithRefundTx if result returned psbt and returns updates", async () => {
    cancelContractMock.mockResolvedValueOnce({
      result: cancelContractSuccessWithPSBT,
      error: undefined,
      ...responseUtils,
    });

    const result = await cancelContractAsSeller(expiredContract);
    expect(cancelContractMock).toHaveBeenCalledWith({
      contractId: contract.id,
    });
    expect(result.result).toBeTruthy();
    expect(result.result).toEqual({
      sellOffer: { ...sellOffer, refundTx: "psbt" },
    });
  });
  it("also handles patchSellOfferWithRefundTx error case", async () => {
    patchOfferMock.mockResolvedValueOnce({
      result: undefined,
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    cancelContractMock.mockResolvedValueOnce({
      result: cancelContractSuccessWithPSBT,
      error: undefined,
      ...responseUtils,
    });

    const result = await cancelContractAsSeller(expiredContract);
    expect(cancelContractMock).toHaveBeenCalledWith({
      contractId: contract.id,
    });
    expect(result.error).toBeTruthy();
    expect(result.error).toBe("UNAUTHORIZED");
    expect(result.result).toEqual({ sellOffer });
  });
});
