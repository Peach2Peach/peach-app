import { waitFor } from "@testing-library/react-native";
import { callWhenInternet } from "./callWhenInternet";

const callbacks: ((...args: unknown[]) => void)[] = [];
const unsubScribeMock = jest.fn();

jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

const fetchMock = jest
  .requireMock("@react-native-community/netinfo")
  .fetch.mockResolvedValue({ isInternetReachable: true });
jest
  .requireMock("@react-native-community/netinfo")
  .addEventListener.mockImplementation((cb: (...args: unknown[]) => void) => {
    callbacks.push(cb);
    return unsubScribeMock;
  });

describe("callWhenInternet", () => {
  const callback = jest.fn();

  it("should run callback when connected to the internet", async () => {
    await callWhenInternet(callback);

    expect(callback).toHaveBeenCalled();
  });
  it("should not run callback immediately when not connected to the internet", async () => {
    fetchMock.mockResolvedValue({ isInternetReachable: false });
    await callWhenInternet(callback);

    expect(callback).not.toHaveBeenCalled();

    const connectedState = {
      isInternetReachable: true,
    };
    callbacks.map((cb) => cb(connectedState));
    expect(callback).toHaveBeenCalled();
    await waitFor(() => {
      expect(unsubScribeMock).toHaveBeenCalled();
    });
  });
  it("should not run callback at all when not connected to the internet", async () => {
    fetchMock.mockResolvedValue({ isInternetReachable: false });
    await callWhenInternet(callback);

    const connectedState = {
      isInternetReachable: false,
    };
    callbacks.map((cb) => cb(connectedState));
    expect(callback).not.toHaveBeenCalled();
    expect(unsubScribeMock).not.toHaveBeenCalled();
  });
});
