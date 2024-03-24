import fetch from "../../fetch";
import { getReverseSubmarineSwaps } from "./getReverseSubmarineSwaps";

jest.mock("../../fetch");

describe("getReverseSubmarineSwaps", () => {
  it("calls endpoint to get submarine list", async () => {
    await getReverseSubmarineSwaps();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:9001/v2/swap/reverse",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "GET",
      },
    );
  });
});
