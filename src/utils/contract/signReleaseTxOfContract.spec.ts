import { signReleaseTxOfContract } from "./signReleaseTxOfContract";
const getSellOfferFromContractMock = jest.fn();
const getEscrowWalletForOfferMock = jest.fn();

jest.mock("./getSellOfferFromContract", () => ({
  getSellOfferFromContract: jest.fn((...args: unknown[]) =>
    getSellOfferFromContractMock(...args),
  ),
}));
jest.mock("./verifyAndSignReleaseTx", () => ({
  verifyAndSignReleaseTx: jest.fn(() => ["tx", null]),
}));
jest.mock("../wallet/getEscrowWalletForOffer", () => ({
  getEscrowWalletForOffer: jest.fn((...args: unknown[]) =>
    getEscrowWalletForOfferMock(...args),
  ),
}));

describe("signReleaseTxOfContract", () => {
  it("should call verifyAndSignReleaseTx with the correct params", () => {
    const contract = { id: "contractId" } as Contract;
    const sellOffer = { id: "sellOfferId" };
    getSellOfferFromContractMock.mockReturnValueOnce(sellOffer);
    getEscrowWalletForOfferMock.mockReturnValueOnce("wallet");
    const result = signReleaseTxOfContract(contract);
    expect(getSellOfferFromContractMock).toHaveBeenCalledWith(contract);
    expect(getEscrowWalletForOfferMock).toHaveBeenCalledWith(sellOffer);
    expect(result).toEqual(["tx", null]);
  });
});
