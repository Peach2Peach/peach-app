import fetch from "../fetch";
import { getTxHex } from "./getTxHex";

jest.mock("../fetch");

describe("getTxHex", () => {
  it("calls endpoint to get UTXO", async () => {
    await getTxHex({ txId: "txId" });
    expect(fetch).toHaveBeenCalledWith("https://localhost:3000/tx/txId/hex", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: "https://localhost:3000",
        Referer: "https://localhost:3000",
      },
      method: "GET",
    });
  });
});
