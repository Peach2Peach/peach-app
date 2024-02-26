import {
  reverseSwapResponse,
  submarineSwapResponse,
} from "../../tests/unit/data/boltzData";
import { useBoltzSwapStore } from "./useBoltzSwapStore";

describe("useBoltzSwapStore", () => {
  const submarineSwap = { ...submarineSwapResponse, keyPairIndex: 1 }
  const reverseSwap = { ...reverseSwapResponse, keyPairIndex: 1, preimage: 'preimage' }

  it("returns defaults", () => {
    expect(useBoltzSwapStore.getState()).toEqual({
      ...useBoltzSwapStore.getState(),
      swaps: {},
    });
  });

  it("stores swap info", () => {
    useBoltzSwapStore.getState().saveSwap("1", submarineSwap);
    useBoltzSwapStore.getState().saveSwap("1", reverseSwap);
    expect(useBoltzSwapStore.getState().swaps).toEqual({
      "1": [submarineSwap, reverseSwap],
    });
  });
  it("removes swap info", () => {
    useBoltzSwapStore.getState().removeSwap("1", submarineSwap.id);
    expect(useBoltzSwapStore.getState().swaps).toEqual({
      "1": [reverseSwap],
    });
  });
});
