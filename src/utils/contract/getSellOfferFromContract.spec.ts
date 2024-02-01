import { getSellOfferFromContract } from "./getSellOfferFromContract";

const getOfferMock = jest.fn();
jest.mock("../offer/getOffer", () => ({
  getOffer: (...args: unknown[]) => getOfferMock(...args),
}));

describe("getSellOfferFromContract", () => {
  it("should return the correct sell offer", () => {
    const contract: Partial<Contract> = {
      id: "123-456",
    };

    const sellOffer: Partial<SellOffer> = {
      id: "123",
    };
    getOfferMock.mockReturnValue(sellOffer as SellOffer);

    expect(getSellOfferFromContract(contract as Contract)).toEqual(sellOffer);
    expect(getOfferMock).toHaveBeenCalledWith("123");
  });
});
