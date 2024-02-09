import {
  paypalData,
  validSEPAData,
} from "../../../tests/unit/data/paymentData";
import { getNewPreferredPaymentMethods } from "./getNewPreferredPaymentMethods";

const paymentData: PaymentData[] = [
  validSEPAData,
  { ...paypalData, hidden: true },
];

describe("getNewPreferredPaymentMethods", () => {
  it("returns new preferred payment methods based on hidden flag", () => {
    const preferredPaymentMethods = {
      sepa: validSEPAData.id,
      paypal: paypalData.id,
    };
    expect(
      getNewPreferredPaymentMethods(preferredPaymentMethods, paymentData),
    ).toEqual({
      sepa: validSEPAData.id,
    });
  });
});
