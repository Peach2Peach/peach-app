import fetch from "../../fetch";
import { getSubmarineSwaps } from "./getSubmarineSwaps";

jest.mock("../../fetch");

describe("getSubmarineSwaps", () => {
  it("calls endpoint to get submarine list", async () => {
    await getSubmarineSwaps();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:9001/v2/swap/submarine",
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
