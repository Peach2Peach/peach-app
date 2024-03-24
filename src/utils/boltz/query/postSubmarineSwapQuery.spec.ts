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
        "021eb94b29bc8c7172295fa1435c9c7e4f6472b458b213b38b1199f3068e7a4cd6",
    });
  });
});
