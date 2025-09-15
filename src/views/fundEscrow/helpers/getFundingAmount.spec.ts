import { sellOffer } from "../../../../tests/unit/data/offerData";
import { getFundingAmount } from "./getFundingAmount";

describe("getFundingAmount", () => {
  it("should get funding amount for a single sell offer", () => {
    expect(getFundingAmount(undefined, sellOffer.amount)).toEqual(
      sellOffer.amount,
    );
  });
  it("should get funding amount for a multiple sell offers", () => {
    const offerIds = ["1", "2", "3"];
    expect(getFundingAmount(offerIds, sellOffer.amount)).toEqual(
      sellOffer.amount * offerIds.length,
    );
  });
  it("should return 0 if no sell offer has been passed", () => {
    expect(getFundingAmount(undefined)).toEqual(0);
  });
});
