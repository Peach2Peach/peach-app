/* eslint-disable max-lines-per-function */
import {
  paypalData,
  revolutData,
  twintData,
  validSEPAData,
  validSEPAData2,
} from "../../../tests/unit/data/paymentData";
import { usePaymentDataStore } from "./usePaymentDataStore";

describe("usePaymentDataStore", () => {
  it("returns defaults", () => {
    expect(usePaymentDataStore.getState()).toEqual({
      addPaymentData: expect.any(Function),
      setPaymentDataHidden: expect.any(Function),
      getPaymentData: expect.any(Function),
      getPaymentDataByLabel: expect.any(Function),
      getAllPaymentDataByType: expect.any(Function),
      getPaymentDataArray: expect.any(Function),
      searchPaymentData: expect.any(Function),
      removePaymentData: expect.any(Function),
      migrated: false,
      paymentData: {},
      paymentDetailInfo: {},
      reset: expect.any(Function),
      setMigrated: expect.any(Function),
    });
  });
  it("sets migrated to true", () => {
    usePaymentDataStore.getState().setMigrated();
    expect(usePaymentDataStore.getState().migrated).toBeTruthy();
  });
  it("adds payment data", () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    expect(usePaymentDataStore.getState().paymentData).toEqual({
      [validSEPAData.id]: validSEPAData,
    });
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual({
      iban: {
        "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3":
          "IE29 AIBK 9311 5212 3456 78",
      },
    });

    usePaymentDataStore.getState().addPaymentData(twintData);
    expect(usePaymentDataStore.getState().paymentData).toEqual({
      [validSEPAData.id]: validSEPAData,
      [twintData.id]: twintData,
    });
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual({
      iban: {
        "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3":
          "IE29 AIBK 9311 5212 3456 78",
      },
      phone: {
        c56ab971aeea3e5aa3d2e62e4ed7cb5488a63b0659e6db7b467e7f899cb7b418:
          "+341234875987",
      },
    });
    usePaymentDataStore.getState().addPaymentData(validSEPAData2);
    expect(usePaymentDataStore.getState().paymentData).toEqual({
      [validSEPAData.id]: validSEPAData,
      [twintData.id]: twintData,
      [validSEPAData2.id]: validSEPAData2,
    });
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual({
      iban: {
        "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3":
          "IE29 AIBK 9311 5212 3456 78",
      },
      phone: {
        c56ab971aeea3e5aa3d2e62e4ed7cb5488a63b0659e6db7b467e7f899cb7b418:
          "+341234875987",
      },
    });
  });
  it("updates `hidden` on the payment data", () => {
    expect(
      usePaymentDataStore.getState().getPaymentData(validSEPAData.id)?.hidden,
    ).toBeFalsy();
    usePaymentDataStore.getState().setPaymentDataHidden(validSEPAData.id, true);
    expect(
      usePaymentDataStore.getState().getPaymentData(validSEPAData.id)?.hidden,
    ).toBeTruthy();
    usePaymentDataStore
      .getState()
      .setPaymentDataHidden(validSEPAData.id, false);
    expect(
      usePaymentDataStore.getState().getPaymentData(validSEPAData.id)?.hidden,
    ).toBeFalsy();
  });
  it("does not updated `hidden` on the payment data that does not exist", () => {
    const snapshot = usePaymentDataStore.getState().paymentData;
    usePaymentDataStore.getState().setPaymentDataHidden("otherId", true);
    expect(usePaymentDataStore.getState().paymentData).toEqual(snapshot);
  });
  it("returns payment data as array", () => {
    expect(usePaymentDataStore.getState().getPaymentDataArray()).toEqual([
      validSEPAData,
      twintData,
      validSEPAData2,
    ]);
  });
  it("returns payment data by id", () => {
    expect(
      usePaymentDataStore.getState().getPaymentData(validSEPAData.id),
    ).toEqual(validSEPAData);
  });
  it("returns undefined if payment data id does not exist", () => {
    expect(
      usePaymentDataStore.getState().getPaymentData("not-existent"),
    ).toBeUndefined();
  });
  it("returns data by label", () => {
    expect(
      usePaymentDataStore.getState().getPaymentDataByLabel(validSEPAData.label),
    ).toEqual(validSEPAData);
    expect(
      usePaymentDataStore.getState().getPaymentDataByLabel(twintData.label),
    ).toEqual(twintData);
  });
  it("returns undefined if payment data for label does not exist", () => {
    expect(
      usePaymentDataStore.getState().getPaymentDataByLabel("not-existent"),
    ).toBeUndefined();
  });
  it("returns all data by type", () => {
    expect(
      usePaymentDataStore.getState().getAllPaymentDataByType("sepa"),
    ).toEqual([validSEPAData, validSEPAData2]);
    expect(
      usePaymentDataStore.getState().getAllPaymentDataByType("twint"),
    ).toEqual([twintData]);
  });
  it("returns empty array if no data exists for type", () => {
    expect(
      usePaymentDataStore.getState().getAllPaymentDataByType("blik"),
    ).toEqual([]);
  });
  it("removes payment data and associated hashes", () => {
    usePaymentDataStore.getState().removePaymentData(twintData.id);
    expect(usePaymentDataStore.getState().getPaymentDataArray()).toEqual([
      validSEPAData,
      validSEPAData2,
    ]);
    expect(usePaymentDataStore.getState().paymentDetailInfo).toEqual({
      iban: {
        "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3":
          "IE29 AIBK 9311 5212 3456 78",
      },
      phone: {},
    });
  });
  it("does not remove payment data that does not exist", () => {
    const snapshot = usePaymentDataStore.getState().paymentData;
    usePaymentDataStore.getState().removePaymentData("otherId");
    expect(usePaymentDataStore.getState().paymentData).toEqual(snapshot);
  });
  it("searches for payment data by given information", () => {
    usePaymentDataStore.getState().addPaymentData(twintData);
    usePaymentDataStore.getState().addPaymentData(revolutData);
    usePaymentDataStore.getState().addPaymentData(paypalData);

    const query = {
      iban: validSEPAData.iban,
    };
    expect(usePaymentDataStore.getState().searchPaymentData(query)).toEqual([
      validSEPAData,
      validSEPAData2,
    ]);
  });
});
