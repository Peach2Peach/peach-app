import { Linking } from "react-native";
import { openInWallet } from "./openInWallet";

describe("openInWallet", () => {
  const openURLMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(Linking, "openURL").mockImplementation(openURLMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call Linking.openURL with the correct payment request", async () => {
    const address = "example_address";
    const paymentRequest = `bitcoin:${address}`;
    await openInWallet(paymentRequest);
    expect(openURLMock).toHaveBeenCalledWith(paymentRequest);
  });

  it("should return true when Linking.openURL resolves", async () => {
    const address = "example_address";
    const paymentRequest = `bitcoin:${address}`;
    openURLMock.mockResolvedValueOnce("first call");
    const result = await openInWallet(paymentRequest);
    expect(result).toBe(true);
  });

  it("should return false when Linking.openURL rejects", async () => {
    const address = "example_address";
    const paymentRequest = `bitcoin:${address}`;
    const error = new Error("Failed to open URL");
    openURLMock.mockRejectedValueOnce(error);
    const result = await openInWallet(paymentRequest);
    expect(result).toBe(false);
  });
});
