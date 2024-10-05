import { act, renderHook, responseUtils, waitFor } from "test-utils";
import {
  twintData,
  validSEPAData,
  validSEPAData2,
  validSEPADataHashes,
} from "../../../../tests/unit/data/paymentData";
import { useConfigStore } from "../../../store/configStore/configStore";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { peachAPI } from "../../../utils/peachAPI";
import { useRemovePaymentData } from "./useRemovePaymentData";

const deletePaymentHashMock = jest.spyOn(
  peachAPI.private.user,
  "deletePaymentHash",
);

jest.useFakeTimers();

describe("removePaymentData", () => {
  beforeEach(() => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    usePaymentDataStore.getState().addPaymentData(validSEPAData2);
    usePaymentDataStore.getState().addPaymentData(twintData);
    useOfferPreferences.getState().setPaymentMethods([]);
    useConfigStore.getState().setPaymentMethods([
      {
        id: "sepa",
        anonymous: false,
        currencies: ["EUR", "CHF"],
        fields: { mandatory: [[["iban", "bic"]]], optional: ["reference"] },
      },
    ]);
  });

  it("does nothing if payment data does not exist", async () => {
    const removePaymentDataSpy = jest.spyOn(
      usePaymentDataStore.getState(),
      "removePaymentData",
    );
    const { result } = renderHook(useRemovePaymentData);
    act(() => {
      result.current.mutate("nonExisting");
    });
    await waitFor(() => {
      expect(removePaymentDataSpy).not.toHaveBeenCalled();
    });
  });
  it("removes payment data from account", async () => {
    const { result } = renderHook(useRemovePaymentData);
    await act(() => result.current.mutate(validSEPAData.id));
    await waitFor(() => {
      expect(usePaymentDataStore.getState().getPaymentDataArray()).toEqual([
        validSEPAData2,
        twintData,
      ]);
      expect(deletePaymentHashMock).toHaveBeenCalledWith({
        hashes: validSEPADataHashes,
      });
    });
  });
  it("updates the offerPreferences state if method was not preferred", async () => {
    useOfferPreferences.getState().setPaymentMethods([validSEPAData2.id]);
    const { result } = renderHook(useRemovePaymentData);
    act(() => {
      result.current.mutate(validSEPAData.id);
    });
    await waitFor(() => {
      expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({
        sepa: validSEPAData2.id,
      });
    });
  });
  it("replaces payment method from preferred payment methods if set and fallback exists", async () => {
    useOfferPreferences.getState().setPaymentMethods([validSEPAData.id]);
    const { result } = renderHook(useRemovePaymentData);
    act(() => {
      result.current.mutate(validSEPAData.id);
    });
    await waitFor(() => {
      expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({
        sepa: validSEPAData2.id,
      });
    });
  });
  it("removes payment method from preferred payment methods if set and no fallback exists", async () => {
    useOfferPreferences.getState().setPaymentMethods([validSEPAData.id]);
    const { result } = renderHook(useRemovePaymentData);
    act(() => {
      result.current.mutate(validSEPAData.id);
    });

    await waitFor(() => {
      expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual({
        sepa: validSEPAData2.id,
      });
    });
    act(() => {
      result.current.mutate(validSEPAData2.id);
    });
    await waitFor(() => {
      expect(useOfferPreferences.getState().preferredPaymentMethods).toEqual(
        {},
      );
    });
  });

  it("does not remove payment data if there is an unexpected error from server request", async () => {
    deletePaymentHashMock.mockResolvedValueOnce({
      // @ts-expect-error testing unexpected error
      error: { error: "UNEXPECTED" },
      ...responseUtils,
    });
    const { result } = renderHook(useRemovePaymentData);
    act(() => {
      result.current.mutate(validSEPAData.id);
    });
    await waitFor(() => {
      expect(
        usePaymentDataStore.getState().getPaymentData(validSEPAData.id),
      ).toEqual(validSEPAData);
    });

    deletePaymentHashMock.mockResolvedValueOnce(responseUtils);
    act(() => {
      result.current.mutate(validSEPAData.id);
    });
    await waitFor(() => {
      expect(
        usePaymentDataStore.getState().getPaymentData(validSEPAData.id),
      ).toEqual(validSEPAData);
    });
  });

  it("removes payment data from account if server error is expected", async () => {
    deletePaymentHashMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    expect(
      usePaymentDataStore.getState().getPaymentData(validSEPAData.id),
    ).not.toBeUndefined();
    const { result } = renderHook(useRemovePaymentData);
    act(() => {
      result.current.mutate(validSEPAData.id);
    });
    await waitFor(() => {
      expect(
        usePaymentDataStore.getState().getPaymentData(validSEPAData.id),
      ).toBeUndefined();
    });
  });
});
