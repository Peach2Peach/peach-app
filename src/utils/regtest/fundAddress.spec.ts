import { fundAddress } from "./fundAddress";

const fetchMock = jest.fn();
jest.mock(
  "../fetch",
  () =>
    (...args: unknown[]) =>
      fetchMock(...args),
);

describe("fundAddress", () => {
  const address = "address";
  const amount = 100000;
  it("should call correct api endpoint", async () => {
    await fundAddress({ address, amount });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://localhost:8080/v1/regtest/fundAddress",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: "https://localhost:8080",
          Referer: "https://localhost:8080",
          "User-Agent": "",
        },
        body: '{"address":"address","amount":100000}',
        method: "POST",
      },
    );
  });
});
