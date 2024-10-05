import { validSEPAData } from "../../../../tests/unit/data/paymentData";
import { useConfigStore } from "../../configStore/configStore";
import { getMeansOfPayment } from "./getMeansOfPayment";

describe("getMeansOfPayment", () => {
  it("should return the expected object", () => {
    useConfigStore
      .getState()
      .setPaymentMethods([
        {
          id: "sepa",
          anonymous: false,
          currencies: ["EUR", "CHF"],
          fields: { mandatory: [[["iban", "bic"]]], optional: ["reference"] },
        },
      ]);
    const mockData = [validSEPAData];
    expect(getMeansOfPayment(mockData)).toEqual({
      EUR: ["sepa"],
    });
  });
});
