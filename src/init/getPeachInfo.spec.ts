import { responseUtils } from "test-utils";
import { useConfigStore } from "../store/configStore/configStore";
import { usePaymentDataStore } from "../store/usePaymentDataStore";
import { peachAPI } from "../utils/peachAPI";
import { getPeachInfo } from "./getPeachInfo";
import { storePeachInfo } from "./storePeachInfo";

jest.mock("../paymentMethods", () => ({
  ...jest.requireActual("../paymentMethods"),
  setPaymentMethods: jest.fn(),
}));
const setPaymentMethodsMock =
  jest.requireMock("../paymentMethods").setPaymentMethods;
const getInfoMock = jest.spyOn(peachAPI.public.system, "getInfo");
const getStatusMock = jest.spyOn(peachAPI.public.system, "getStatus");

jest.useFakeTimers();
jest
  .spyOn(global.Date, "now")
  .mockReturnValue(new Date("2021-01-01").getTime());
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
    getStatusMock.mockResolvedValueOnce({
      error: { error: "INTERNAL_SERVER_ERROR" },
      ...responseUtils,
    });

    const response = await getPeachInfo();

    expect(response).toEqual({ error: "INTERNAL_SERVER_ERROR" });
    expect(setPaymentMethodsMock).toHaveBeenCalledWith(paymentMethods);
    expect(storePeachInfo).not.toHaveBeenCalled();
  });

  it("stores peach info when getInfo returns a successful response", async () => {
    const serverStatus = {
      error: null,
      status: "online" as const,
      serverTime: Date.now(),
    };
    getStatusMock.mockResolvedValueOnce({
      result: serverStatus,
      ...responseUtils,
    });
    const response = await getPeachInfo();

    expect(response).toEqual(serverStatus);
    expect(getInfoMock).toHaveBeenCalledTimes(1);
    expect(storePeachInfo).toHaveBeenCalledWith({ info: "info" });
  });

  it("updates payment method from store if getInfo does not return a successful response", async () => {
    const serverStatus = {
      error: null,
      status: "online" as const,
      serverTime: Date.now(),
    };
    getStatusMock.mockResolvedValueOnce({
      result: serverStatus,
      ...responseUtils,
    });
    getInfoMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });

    const response = await getPeachInfo();

    expect(response).toEqual(serverStatus);
    expect(setPaymentMethodsMock).toHaveBeenCalledWith(paymentMethods);
    expect(storePeachInfo).not.toHaveBeenCalled();
  });
});
