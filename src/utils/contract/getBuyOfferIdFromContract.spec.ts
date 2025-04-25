import { Contract } from "../../../peach-api/src/@types/contract";
import { getBuyOfferIdFromContract } from "./getBuyOfferIdFromContract";

describe("getBuyOfferIdFromContract", () => {
  it("should return the correct buy offer id", () => {
    const contract: Partial<Contract> = {
      id: "123-456",
    };

    expect(getBuyOfferIdFromContract(contract as Contract)).toEqual("456");
  });
});
