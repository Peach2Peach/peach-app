import fetch from "../fetch";
import { getAddressTxs } from "./getAddressTxs";

jest.mock("../fetch");

describe("getAddressTxs", () => {
  it("calls endpoint to get UTXO", async () => {
    await getAddressTxs({ address: "address" });
    expect(fetch).toHaveBeenCalledWith(
      "https://localhost:3000/address/address/txs",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: "https://localhost:3000",
          Referer: "https://localhost:3000",
        },
        method: "GET",
      },
    );
  });
});
