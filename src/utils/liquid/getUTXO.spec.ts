import fetch from "../fetch";
import { getUTXO } from "./getUTXO";

jest.mock("../fetch");

describe("getUTXO", () => {
  it("calls endpoint to get UTXO", async () => {
    await getUTXO({ address: "address" });
    expect(fetch).toHaveBeenCalledWith(
      "https://localhost:3000/address/address/utxo",
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
