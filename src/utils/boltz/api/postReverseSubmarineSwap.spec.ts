import fetch from "../../fetch";
import { postReverseSubmarineSwap } from "./postReverseSubmarineSwap";

jest.mock("../../fetch");

describe("getSpostReverseSubmarineSwapwapStatus", () => {
  it("calls endpoint to post reverse submarine swap", async () => {
    const body = {
      from: "BTC",
      to: "BTC",
      address: "address",
      invoiceAmount: 1000,
      claimPublicKey: "claimPublicKey",
      preimageHash: "preimageHash",
    };
    await postReverseSubmarineSwap(body);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:9001/v2/swap/reverse",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  });
});
