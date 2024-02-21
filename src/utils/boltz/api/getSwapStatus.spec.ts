import fetch from "../../fetch";
import { getSwapStatus } from "./getSwapStatus";

jest.mock("../../fetch");

describe("getSwapStatus", () => {
  it("calls endpoint to get swap status", async () => {
    await getSwapStatus({id: 'swapId'});
    expect(fetch).toHaveBeenCalledWith("http://localhost:9001/v2/swap/swapId", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    });
  });
});
