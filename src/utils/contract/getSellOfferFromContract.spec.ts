import { getSellOfferFromContract } from "./getSellOfferFromContract";

jest.mock("../offer/getOffer");
const getOfferMock = jest.requireMock("../offer/getOffer").getOffer;

describe("getSellOfferFromContract", () => {
  it("should return the correct sell offer", async () => {
    const contract: Partial<Contract> = {
      id: "123-456",
    };

    const sellOffer: Partial<SellOffer> = {
      id: "123",
      type: "ask",
    };
    getOfferMock.mockReturnValue(sellOffer as SellOffer);

    expect(await getSellOfferFromContract(contract as Contract)).toEqual(
      sellOffer,
    );
    expect(getOfferMock).toHaveBeenCalledWith("123");
  });
});
