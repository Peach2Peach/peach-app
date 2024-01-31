import { act, renderHook } from "test-utils";
import { navigateMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { useGetPNActionHandler } from "./useGetPNActionHandler";

// eslint-disable-next-line max-lines-per-function
describe("useGetPNActionHandler", () => {
  it("should return an action properties when contractId and isChat are truthy", () => {
    const { result } = renderHook(useGetPNActionHandler);
    const data = {
      type: "contract.chat",
      contractId: "123-456",
      isChat: "true",
    } as PNData;
    let action;
    act(() => {
      action = result.current(data);
      action?.onPress();
    });
    expect(action).toMatchObject({
      label: expect.any(String),
      iconId: expect.any(String),
      onPress: expect.any(Function),
    });
    expect(navigateMock).toHaveBeenCalledWith("contractChat", {
      contractId: data.contractId,
    });
  });

  it("should return an action properties when contractId is truthy", () => {
    const { result } = renderHook(useGetPNActionHandler);
    const data = {
      type: "contract.paymentMade",
      contractId: "123-456",
    } as PNData;
    let action;
    act(() => {
      action = result.current(data);
      action?.onPress();
    });
    expect(action).toMatchObject({
      label: expect.any(String),
      iconId: expect.any(String),
      onPress: expect.any(Function),
    });
    expect(navigateMock).toHaveBeenCalledWith("contract", {
      contractId: data.contractId,
    });
  });

  it("should return an action properties when offerId and type are truthy and type is in offerSummaryEvents", () => {
    const { result } = renderHook(useGetPNActionHandler);
    const data = { type: "offer.notFunded", offerId: "123" } as PNData;
    let action;
    act(() => {
      action = result.current(data);
      action?.onPress();
    });
    expect(action).toMatchObject({
      label: expect.any(String),
      iconId: expect.any(String),
      onPress: expect.any(Function),
    });
    expect(navigateMock).toHaveBeenCalledWith("offer", {
      offerId: data.offerId,
    });
  });

  it("should return an action properties when offerId and type are truthy and type is in searchEvents", () => {
    const { result } = renderHook(useGetPNActionHandler);
    const data = { type: "offer.matchSeller", offerId: "123" } as PNData;
    let action;
    act(() => {
      action = result.current(data);
      action?.onPress();
    });
    expect(action).toMatchObject({
      label: expect.any(String),
      iconId: expect.any(String),
      onPress: expect.any(Function),
    });
    expect(navigateMock).toHaveBeenCalledWith("search", {
      offerId: data.offerId,
    });
  });

  it("should return undefined if no match is found", () => {
    const { result } = renderHook(useGetPNActionHandler);
    // @ts-expect-error testing invalid data
    const data = { type: "someOtherType" } as PNData;
    let action;
    act(() => {
      action = result.current(data);
    });
    expect(action).toBeUndefined();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
