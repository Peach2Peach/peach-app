import { getBuyOfferFromContract } from "./getBuyOfferFromContract";

jest.mock("../offer/getOffer");
const getOfferMock = jest.requireMock("../offer/getOffer").getOffer;

describe("getBuyOfferFromContract", () => {
  it("should return the correct buy offer", () => {
    const contract: Partial<Contract> = {
      id: "123-456",
    };

    const buyOffer: Partial<BuyOffer> = {
      id: "456",
    };
    getOfferMock.mockReturnValue(buyOffer as BuyOffer);

    expect(getBuyOfferFromContract(contract as Contract)).toEqual(buyOffer);
    expect(getOfferMock).toHaveBeenCalledWith("456");
  });
});
