import { isNetworkError } from "./isNetworkError";

describe("isNetworkError", () => {
  it("checks whether an error is a network error", () => {
    expect(isNetworkError("Network request failed")).toBe(true);
    expect(isNetworkError("NETWORK_ERROR")).toBe(true);
    expect(isNetworkError("ABORTED")).toBe(true);
    expect(isNetworkError("Aborted")).toBe(true);
  });
  it("checks whether an error is not a network error", () => {
    expect(isNetworkError("UNKNOWN")).toBe(false);
    expect(isNetworkError(null)).toBe(false);
    expect(isNetworkError()).toBe(false);
    expect(isNetworkError("Not found")).toBe(false);
  });
});
