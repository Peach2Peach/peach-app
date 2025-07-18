import {
  paypalData,
  paypalDataHashes,
  revolutData,
  revolutDataHashes,
  validSEPAData,
  validSEPADataHashes,
} from "../../../tests/unit/data/paymentData";
import { setPaymentMethods } from "../../paymentMethods";
import { usePaymentDataStore } from "../usePaymentDataStore";
import { useOfferPreferences } from "./useOfferPreferences";

describe("useOfferPreferences - store", () => {
  it("should return a store", () => {
    expect(useOfferPreferences).toBeDefined();
  });
  it("should persist the store", () => {
    expect(useOfferPreferences.persist.getOptions()).toStrictEqual(
      expect.objectContaining({
        name: "offerPreferences",
        version: expect.any(Number),
        storage: expect.any(Object),
      }),
    );
  });
});

describe("useOfferPreferences - actions - setBuyAmountRange", () => {
  it("should update the buy amount range", () => {
    const MIN = 50000;
    const MAX = 3200000;
    const newRange: [number, number] = [MIN, MAX];
    useOfferPreferences.getState().setBuyAmountRange(newRange);
    expect(useOfferPreferences.getState().buyAmountRange).toStrictEqual(
      newRange,
    );
  });
});

describe("useOfferPreferences - actions - setSellAmount", () => {
  it("should update the sell amount", () => {
    const newSellAmount = 50000;
    useOfferPreferences.getState().setSellAmount(newSellAmount);
    expect(useOfferPreferences.getState().sellAmount).toBe(newSellAmount);
  });
});

describe("useOfferPreferences - actions - setMulti", () => {
  it("should update multi", () => {
    const newMulti = 5;
    useOfferPreferences.getState().setMulti(newMulti);
    expect(useOfferPreferences.getState().multi).toBe(newMulti);
  });
  it("should reset multi", () => {
    const newMulti = undefined;
    useOfferPreferences.getState().setMulti(newMulti);
    expect(useOfferPreferences.getState().multi).toBe(newMulti);
  });
});

describe("useOfferPreferences - actions - setPremium", () => {
  it("should update the premium", () => {
    const newPremium = 21;
    useOfferPreferences.getState().setPremium(newPremium);
    expect(useOfferPreferences.getState().premium).toBe(newPremium);
  });
});

describe("useOfferPreferences - actions - setPaymentMethods", () => {
  const ids = [validSEPAData.id, paypalData.id, revolutData.id];

  beforeAll(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    usePaymentDataStore.getState().addPaymentData(paypalData);
    usePaymentDataStore.getState().addPaymentData(revolutData);

    setPaymentMethods([
      {
        id: "sepa",
        currencies: ["EUR", "CHF"],
        fields: { mandatory: [], optional: [] },
        anonymous: false,
      },
      {
        id: "revolut",
        currencies: ["EUR"],
        fields: { mandatory: [], optional: [] },
        anonymous: false,
      },
      {
        id: "paypal",
        currencies: ["EUR"],
        fields: { mandatory: [], optional: [] },
        anonymous: false,
      },
    ]);
  });

  it("should update the preferred payment methods", () => {
    useOfferPreferences.getState().setPaymentMethods(ids);
    const expected = {
      sepa: validSEPAData.id,
      revolut: revolutData.id,
      paypal: paypalData.id,
    };
    expect(
      useOfferPreferences.getState().preferredPaymentMethods,
    ).toStrictEqual(expected);
  });
  it("should update the means of payment", () => {
    useOfferPreferences.getState().setPaymentMethods(ids);
    const expected = {
      EUR: ["sepa", "paypal", "revolut"],
    };
    expect(useOfferPreferences.getState().meansOfPayment).toStrictEqual(
      expected,
    );
  });
  it("should update the payment data", () => {
    useOfferPreferences.getState().setPaymentMethods(ids);
    const expected = {
      sepa: { country: undefined, hashes: validSEPADataHashes },
      paypal: { country: undefined, hashes: paypalDataHashes },
      revolut: { country: undefined, hashes: revolutDataHashes },
    };
    expect(useOfferPreferences.getState().paymentData).toStrictEqual(expected);
  });
  it("should update the original payment data", () => {
    useOfferPreferences.getState().setPaymentMethods(ids);
    const expected = [validSEPAData, paypalData, revolutData];
    expect(useOfferPreferences.getState().originalPaymentData).toStrictEqual(
      expected,
    );
  });
});

describe("useOfferPreferences - actions - selectPaymentMethod", () => {
  beforeAll(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    setPaymentMethods([
      {
        id: "sepa",
        currencies: ["EUR", "CHF"],
        fields: { mandatory: [], optional: [] },
        anonymous: false,
      },
    ]);
    useOfferPreferences.getState().setPaymentMethods([]);
  });
  afterEach(() => {
    useOfferPreferences.getState().setPaymentMethods([]);
  });
  const id = validSEPAData.id;
  it("should add the payment method to the preferred payment methods", () => {
    useOfferPreferences.getState().togglePaymentMethod(id);
    const expected = {
      sepa: validSEPAData.id,
    };
    expect(
      useOfferPreferences.getState().preferredPaymentMethods,
    ).toStrictEqual(expected);
  });
  it("should remove the payment method if it is already in the preferred payment methods", () => {
    useOfferPreferences.getState().togglePaymentMethod(id);
    useOfferPreferences.getState().togglePaymentMethod(id);
    const expected = {};
    expect(
      useOfferPreferences.getState().preferredPaymentMethods,
    ).toStrictEqual(expected);
  });
  it("should add the payment method to the means of payment", () => {
    useOfferPreferences.getState().togglePaymentMethod(id);
    const expected = {
      EUR: ["sepa"],
    };
    expect(useOfferPreferences.getState().meansOfPayment).toStrictEqual(
      expected,
    );
  });
  it("should remove the payment method if it is already in the means of payment", () => {
    useOfferPreferences.getState().togglePaymentMethod(id);
    useOfferPreferences.getState().togglePaymentMethod(id);
    const expected = {};
    expect(useOfferPreferences.getState().meansOfPayment).toStrictEqual(
      expected,
    );
  });
  it("should add the payment data to the payment data", () => {
    useOfferPreferences.getState().togglePaymentMethod(id);
    const expected = {
      sepa: { country: undefined, hashes: validSEPADataHashes },
    };
    expect(useOfferPreferences.getState().paymentData).toStrictEqual(expected);
  });
  it("should remove the payment data if it is already in the payment data", () => {
    useOfferPreferences.getState().togglePaymentMethod(id);
    useOfferPreferences.getState().togglePaymentMethod(id);
    const expected = {};
    expect(useOfferPreferences.getState().paymentData).toStrictEqual(expected);
  });
  it("should add the payment data to the original payment data", () => {
    useOfferPreferences.getState().togglePaymentMethod(id);
    expect(useOfferPreferences.getState().originalPaymentData).toStrictEqual([
      validSEPAData,
    ]);
  });
  it("should remove the payment data if it is already in the original payment data", () => {
    useOfferPreferences.getState().togglePaymentMethod(id);
    useOfferPreferences.getState().togglePaymentMethod(id);
    const expected: PaymentData[] = [];
    expect(useOfferPreferences.getState().originalPaymentData).toStrictEqual(
      expected,
    );
  });
});

describe("useOfferPreferences - actions - setPrefferedCurrencyType", () => {
  it("should update the preferred currencytype", () => {
    expect(useOfferPreferences.getState().preferredCurrenyType).toBe("europe");
    useOfferPreferences.getState().setPreferredCurrencyType("other");
    expect(useOfferPreferences.getState().preferredCurrenyType).toBe("other");
  });
});

describe("useOfferPreferences - actions - setBuyOfferSorter", () => {
  it("should update the buy offer sorter", () => {
    const sorter = "highestAmount";
    useOfferPreferences.getState().setBuyOfferSorter(sorter);
    expect(useOfferPreferences.getState().sortBy.buyOffer).toStrictEqual([
      sorter,
    ]);
  });
});

describe("useOfferPreferences - actions - setSellOfferSorter", () => {
  it("should update the sell offer sorter", () => {
    const sorter = "highestPrice";
    useOfferPreferences.getState().setSellOfferSorter(sorter);
    expect(useOfferPreferences.getState().sortBy.sellOffer).toStrictEqual([
      sorter,
    ]);
  });
});
