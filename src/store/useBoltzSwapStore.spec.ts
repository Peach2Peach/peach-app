import {
  reverseSwapResponse,
  submarineSwapResponse,
} from "../../tests/unit/data/boltzData";
import { useBoltzSwapStore } from "./useBoltzSwapStore";

describe("useBoltzSwapStore", () => {
  it("returns defaults", () => {
    expect(useBoltzSwapStore.getState()).toEqual({
      ...useBoltzSwapStore.getState(),
      swaps: {},
    });
  });

  it("stores swap info", () => {
    useBoltzSwapStore.getState().saveSwap("1", submarineSwapResponse);
    useBoltzSwapStore.getState().saveSwap("1", reverseSwapResponse);
    expect(useBoltzSwapStore.getState().swaps).toEqual({
      "1": [submarineSwapResponse, reverseSwapResponse],
    });
  });
  it("removes swap info", () => {
    useBoltzSwapStore.getState().removeSwap("1", submarineSwapResponse.id);
    expect(useBoltzSwapStore.getState().swaps).toEqual({
      "1": [reverseSwapResponse],
    });
  });
});
