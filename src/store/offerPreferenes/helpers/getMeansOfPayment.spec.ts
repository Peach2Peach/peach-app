import { validSEPAData } from "../../../../tests/unit/data/paymentData";
import { getMeansOfPayment } from "./getMeansOfPayment";

describe("getMeansOfPayment", () => {
  it("should return the expected object", () => {
    const mockData = [validSEPAData];
    expect(getMeansOfPayment(mockData)).toEqual({
      EUR: ["sepa"],
    });
  });
});
