import { getSellOfferFromContract } from "./getSellOfferFromContract";

jest.mock("../offer/getOffer");
const getOfferMock = jest.requireMock("../offer/getOffer").getOffer;

describe("getSellOfferFromContract", () => {
  it("should return the correct sell offer", () => {
    const sellOffer: Partial<SellOffer> = {
      id: "123",
      type: "ask",
    };
    getOfferMock.mockReturnValue(sellOffer as SellOffer);

    expect(getSellOfferFromContract("123-456")).toEqual(sellOffer);
    expect(getOfferMock).toHaveBeenCalledWith("123");
  });
});
