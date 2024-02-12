import { generateLiquidBlock } from "./generateLiquidBlock";

const fetchMock = jest.fn();
jest.mock(
  "../fetch",
  () =>
    (...args: unknown[]) =>
      fetchMock(...args),
);

describe("generateLiquidBlock", () => {
  it("should call correct api endpoint", async () => {
    await generateLiquidBlock();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://localhost:8080/v1/regtest/liquid/generateBlock",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: "https://localhost:8080",
          Referer: "https://localhost:8080",
          "User-Agent": "",
        },
        method: "GET",
      },
    );
  });
});
