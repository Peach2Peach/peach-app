import { validSEPAData } from "../../../../tests/unit/data/paymentData";
import { useConfigStore } from "../../configStore/configStore";
import { usePaymentDataStore } from "../../usePaymentDataStore";
import { getOriginalPaymentData } from "./getOriginalPaymentData";

describe("getOriginalPaymentData", () => {
  it("should return the expected object", () => {
    useConfigStore.getState().setPaymentMethods([
      {
        id: "sepa",
        currencies: ["EUR"],
        anonymous: false,
        fields: {
          mandatory: [[["iban"]]],
          optional: [],
        },
      },
    ]);
    const mockData = { sepa: validSEPAData.id };
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    expect(getOriginalPaymentData(mockData)).toEqual([validSEPAData]);
  });
});
