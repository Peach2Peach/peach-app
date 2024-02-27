import { getResult } from "../../../../peach-api/src/utils/result/getResult";
import { submarineSwapResponse } from "../../../../tests/unit/data/boltzData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../wallet/setWallet";
import { postSubmarineSwapQuery } from "./postSubmarineSwapQuery";

jest.mock("../api/postSubmarineSwap");
const postSubmarineSwapMock = jest
  .requireMock("../api/postSubmarineSwap")
  .postSubmarineSwap.mockResolvedValue(getResult(submarineSwapResponse));

jest.useFakeTimers();

const peachWallet = new PeachLiquidJSWallet({ wallet: createTestWallet() });
setLiquidWallet(peachWallet);

describe("postSubmarineSwapQuery", () => {
  afterEach(() => {
    queryClient.clear();
  });

  it("posts a reverse submarine swap request", async () => {
    await postSubmarineSwapQuery({
      invoice: "invoice",
    });
    expect(postSubmarineSwapMock).toHaveBeenCalledWith({
      from: "L-BTC",
      to: "BTC",
      invoice: "invoice",
      referralId: "peach",
      refundPublicKey:
        "02a2f3cfc8519a7e5ed3eb88a753f539c1d51c8416fa0a256c5988345e7031b748",
    });
  });
});
