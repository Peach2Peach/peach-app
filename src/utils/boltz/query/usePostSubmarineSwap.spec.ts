import { getResult } from "../../../../peach-api/src/utils/result/getResult";
import { submarineSwapResponse } from "../../../../tests/unit/data/boltzData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../wallet/setWallet";
import { postSubmarineSwapQuery } from "./postSubmarineSwapQuery";

jest.mock("../api/postSubmarineSwap");
const postSubmarineSwapMock = jest.requireMock("../api/postSubmarineSwap").postSubmarineSwap.mockResolvedValue(getResult(submarineSwapResponse))

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
    })
    expect(postSubmarineSwapMock).toHaveBeenCalledWith({
      from: 'L-BTC',
      to: 'BTC',
      invoice: "invoice",
      "referralId": "peach",
      "refundPublicKey": "026844a6deb2eed7c885e1c82d70729581942a1d4a523fafd46e3950d155e24a51"
    });
  });
});
