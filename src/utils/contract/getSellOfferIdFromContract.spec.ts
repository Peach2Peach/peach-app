import { getSellOfferIdFromContract } from "./getSellOfferIdFromContract";

describe("getSellOfferIdFromContract", () => {
  it("should return the correct sell offer id", () => {
    expect(getSellOfferIdFromContract({ id: "123-456" })).toEqual("123");
  });
});
