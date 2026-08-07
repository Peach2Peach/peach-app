import fetch from "../fetch";
import { COUNTRY_LOOKUP_TIMEOUT_MS, getUserCountry } from "./getUserCountry";

jest.mock("../fetch");
const fetchMock = jest.mocked(fetch);

describe("getUserCountry", () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it("requests the cloudflare trace endpoint", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("loc=US\n"),
    } as unknown as Response);

    await getUserCountry();

    expect(fetch).toHaveBeenCalledWith("https://localhost:8080/cdn-cgi/trace", {
      signal: expect.any(AbortSignal),
    });
  });

  it("times out the request so it can never hang the boot path", async () => {
    jest.useFakeTimers();
    fetchMock.mockResolvedValueOnce({ ok: false } as unknown as Response);

    await getUserCountry();

    const { signal } = fetchMock.mock.calls[0][1] as RequestInit;
    expect(signal?.aborted).toBe(false);
    jest.advanceTimersByTime(COUNTRY_LOOKUP_TIMEOUT_MS);
    expect(signal?.aborted).toBe(true);

    jest.useRealTimers();
  });

  it("returns null when the request throws", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Aborted"));

    expect(await getUserCountry()).toBeNull();
  });

  it("parses the country code from the trace response", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve("fl=abc\nh=api.peachbitcoin.com\nloc=MA\ntls=TLSv1.3\n"),
    } as unknown as Response);

    expect(await getUserCountry()).toBe("MA");
  });

  it("returns null when the request fails", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false } as unknown as Response);

    expect(await getUserCountry()).toBeNull();
  });

  it("returns null when no country is present", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("fl=abc\nh=api.peachbitcoin.com\n"),
    } as unknown as Response);

    expect(await getUserCountry()).toBeNull();
  });
});
