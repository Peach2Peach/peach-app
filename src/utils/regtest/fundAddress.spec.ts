import fetch from "../fetch";
import { fundAddress } from "./fundAddress";

jest.mock("../fetch");

describe("fundAddress", () => {
  const address = "address";
  const amount = 100000;
  it("should call correct api endpoint", async () => {
    await fundAddress({ address, amount });
    expect(fetch).toHaveBeenCalledWith(
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
