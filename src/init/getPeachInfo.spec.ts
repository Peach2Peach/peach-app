import { responseUtils } from "test-utils";
import { useConfigStore } from "../store/configStore/configStore";
import { usePaymentDataStore } from "../store/usePaymentDataStore";
import { peachAPI } from "../utils/peachAPI";
import { getPeachInfo } from "./getPeachInfo";
import { storePeachInfo } from "./storePeachInfo";

const setPaymentMethodsMock = jest.fn();
jest.mock("../paymentMethods", () => ({
  ...jest.requireActual("../paymentMethods"),
  setPaymentMethods: (...args: unknown[]) => setPaymentMethodsMock(...args),
}));
const getInfoMock = jest.spyOn(peachAPI.public.system, "getInfo");
const calculateClientServerTimeDifferenceMock = jest.fn();
jest.mock("./calculateClientServerTimeDifference", () => ({
  calculateClientServerTimeDifference: () =>
    calculateClientServerTimeDifferenceMock(),
}));

jest.useFakeTimers();
jest.mock("./storePeachInfo");

describe("getPeachInfo", () => {
  const paymentMethods: PaymentMethodInfo[] = [
    {
      id: "sepa",
      currencies: ["EUR"],
      anonymous: false,
    },
  ];
  beforeEach(() => {
    const useConfigStoreHydrated = jest.spyOn(
      useConfigStore.persist,
      "hasHydrated",
    );
    const usePaymentDataStoreHydrated = jest.spyOn(
      usePaymentDataStore.persist,
      "hasHydrated",
    );

    useConfigStoreHydrated.mockReturnValue(true);
    usePaymentDataStoreHydrated.mockReturnValue(true);

    useConfigStore.setState({ paymentMethods });
  });
  it("returns error response when server is not available", async () => {
    calculateClientServerTimeDifferenceMock.mockResolvedValueOnce(undefined);

    const response = await getPeachInfo();

    expect(response).toEqual(undefined);
    expect(setPaymentMethodsMock).toHaveBeenCalledWith(paymentMethods);
    expect(storePeachInfo).not.toHaveBeenCalled();
  });

  it("stores peach info when getInfo returns a successful response", async () => {
    const serverStatus = {
      error: null,
      status: "online",
      serverTime: Date.now(),
    };
    calculateClientServerTimeDifferenceMock.mockResolvedValueOnce([
      serverStatus,
      null,
    ]);
    const response = await getPeachInfo();

    expect(response).toEqual([serverStatus, null]);
    expect(getInfoMock).toHaveBeenCalledTimes(1);
    expect(storePeachInfo).toHaveBeenCalledWith({ info: "info" });
  });

  it("returns status response when getInfo returns an error", async () => {
    getInfoMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });

    const response = await getPeachInfo();

    expect(response).toEqual(undefined);
    expect(setPaymentMethodsMock).toHaveBeenCalledWith(paymentMethods);
    expect(storePeachInfo).not.toHaveBeenCalled();
  });

  it("updates payment method from store if getInfo does not return a successful response", async () => {
    const serverStatus = {
      error: null,
      status: "online",
      serverTime: Date.now(),
    };
    calculateClientServerTimeDifferenceMock.mockResolvedValueOnce([
      serverStatus,
      null,
    ]);
    getInfoMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });

    const response = await getPeachInfo();

    expect(response).toEqual([serverStatus, null]);
    expect(setPaymentMethodsMock).toHaveBeenCalledWith(paymentMethods);
    expect(storePeachInfo).not.toHaveBeenCalled();
  });
});
