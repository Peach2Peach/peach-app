import { renderHook, waitFor } from "test-utils";
import { getResult } from "../../../../peach-api/src/utils/result/getResult";
import { reverseSwapResponse } from "../../../../tests/unit/data/boltzData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../wallet/setWallet";
import { usePostReverseSubmarineSwap } from "./usePostReverseSubmarineSwap";

jest.mock("../api/postReverseSubmarineSwap");
jest
  .requireMock("../api/postReverseSubmarineSwap")
  .postReverseSubmarineSwap.mockResolvedValue(getResult(reverseSwapResponse));

jest.useFakeTimers();

const peachWallet = new PeachLiquidJSWallet({ wallet: createTestWallet() });
setLiquidWallet(peachWallet);

describe("usePostReverseSubmarineSwap", () => {
  afterEach(() => {
    queryClient.clear();
  });

  it("posts a reverse submarine swap request", async () => {
    const { result } = renderHook(usePostReverseSubmarineSwap, {
      initialProps: {
        address: "address",
        amount: 1000,
      },
    });
    expect(result.current).toEqual({
      data: undefined,
      isLoading: true,
      error: null,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toEqual({
      data: {
        swapInfo: reverseSwapResponse,
        keyPairIndex: 1,
        keyPairWIF: expect.any(String),
        preimage: expect.any(String),
      },
      isLoading: false,
      error: null,
    });
  });
});