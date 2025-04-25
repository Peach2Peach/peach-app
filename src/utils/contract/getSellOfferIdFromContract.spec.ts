import { getSellOfferIdFromContract } from "./getSellOfferIdFromContract";

describe("getSellOfferIdFromContract", () => {
  it("should return the correct sell offer id", () => {
    const contract: Partial<Contract> = {
      id: "123-456",
    };

    expect(getSellOfferIdFromContract(contract as Contract)).toEqual("123");
  });
});
