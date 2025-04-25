import fetch from "./fetch";

describe("fetch", () => {
  const mockFetch = jest
    .fn()
    .mockImplementation(() => Promise.resolve({ ok: true }));
  global.fetch = mockFetch;

  it("should return a promise", () => {
    const result = fetch("https://example.com");
    expect(result).toBeInstanceOf(Promise);
  });

  it("should call fetch with the correct arguments", () => {
    fetch("https://example.com");
    expect(mockFetch).toHaveBeenCalledWith("https://example.com", undefined);
  });

  it("should call fetch with the correct arguments when init is passed", () => {
    fetch("https://example.com", { method: "POST" });
    expect(mockFetch).toHaveBeenCalledWith("https://example.com", {
      method: "POST",
    });
  });

  it("should return a promise that resolves with the response", async () => {
    const response = { ok: true };
    mockFetch.mockReturnValueOnce(Promise.resolve(response));
    const result = await fetch("https://example.com");
    expect(result).toEqual(response);
  });

  it("should return a promise that resolves with the error", async () => {
    const error = new Error("error");
    mockFetch.mockReturnValueOnce(Promise.reject(error));
    const result = await fetch("https://example.com");
    expect(result).toEqual(error);
  });

  it("should return a promise that resolves with the error when the request is aborted", async () => {
    const error = new Error("error");
    error.message = "Aborted";
    mockFetch.mockReturnValueOnce(Promise.reject(error));
    const result = await fetch("https://example.com");
    expect(result).toEqual(error);
    expect(result.statusText).toEqual("Aborted");
  });
});
