import fetch from "../../fetch";
import { postSubmarineSwap } from "./postSubmarineSwap";

jest.mock("../../fetch");

describe("postSubmarineSwap", () => {
  it("calls endpoint to post submarine swap", async () => {
    const body = {
      from: "BTC",
      to: "BTC",
      refundPublicKey: "refundPublicKey",
      invoice: "invoice",
    };
    await postSubmarineSwap(body);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:9001/v2/swap/submarine",
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
