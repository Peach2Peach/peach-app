import {
  paypalData,
  validSEPAData,
} from "../../../../tests/unit/data/paymentData";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { checkSupportedPaymentMethods } from "./checkSupportedPaymentMethods";

const paymentInfo: PaymentMethodInfo[] = [
  {
    id: "sepa",
    currencies: ["EUR"],
    anonymous: false,
  },
];

describe("checkSupportedPaymentMethods", () => {
  beforeEach(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    usePaymentDataStore.getState().addPaymentData(paypalData);
    useOfferPreferences
      .getState()
      .setPaymentMethods([validSEPAData.id, paypalData.id]);
  });

  it("sets inactive flag on payment methods that are not supported", async () => {
    const [method1, method2] = await checkSupportedPaymentMethods(paymentInfo);
    expect(method1.hidden).toEqual(false);
    expect(method2.hidden).toEqual(true);
  });
  it("calls setPreferredPaymentMethods to update settings with new preferred methods", async () => {
    const setPaymentMethodsSpy = jest.spyOn(
      useOfferPreferences.getState(),
      "setPaymentMethods",
    );

    await checkSupportedPaymentMethods(paymentInfo);

    expect(setPaymentMethodsSpy).toHaveBeenCalledWith([validSEPAData.id]);
  });
  it("calls updatePaymentData with new data", async () => {
    await checkSupportedPaymentMethods(paymentInfo);
    expect(Object.values(usePaymentDataStore.getState().paymentData)).toEqual([
      { ...validSEPAData, hidden: false },
      { ...paypalData, hidden: true },
    ]);
  });
});
