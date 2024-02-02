import { signReleaseTxOfContract } from "./signReleaseTxOfContract";

jest.mock("./getSellOfferFromContract");
jest.mock("./verifyAndSignReleaseTx", () => ({
  verifyAndSignReleaseTx: jest.fn(() => ["tx", null]),
}));
jest.mock("../wallet/getEscrowWalletForOffer");
const getSellOfferFromContractMock = jest.requireMock(
  "./getSellOfferFromContract",
).getSellOfferFromContract;
const getEscrowWalletForOfferMock = jest.requireMock(
  "../wallet/getEscrowWalletForOffer",
).getEscrowWalletForOffer;

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
