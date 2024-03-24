import {
  reverseSwapResponse,
  submarineSwapResponse,
} from "../../tests/unit/data/boltzData";
import { useBoltzSwapStore } from "./useBoltzSwapStore";

describe("useBoltzSwapStore", () => {
  const submarineSwap = { ...submarineSwapResponse, keyPairIndex: 1 };
  const reverseSwap = {
    ...reverseSwapResponse,
    keyPairIndex: 1,
    preimage: "preimage",
  };

  it("returns defaults", () => {
    expect(useBoltzSwapStore.getState()).toEqual({
      ...useBoltzSwapStore.getState(),
      swaps: {},
      map: {},
    });
  });

  it("stores swap info", () => {
    useBoltzSwapStore.getState().saveSwap(submarineSwap);
    useBoltzSwapStore.getState().saveSwap(reverseSwap);
    expect(useBoltzSwapStore.getState().swaps).toEqual({
      [submarineSwap.id]: submarineSwap,
      [reverseSwap.id]: reverseSwap,
    });
  });
  it("maps an arbitrary id to a swap id", () => {
    useBoltzSwapStore.getState().mapSwap("1", submarineSwap.id);
    expect(useBoltzSwapStore.getState().map).toEqual({
      "1": [submarineSwap.id],
    });
  });
  it("removes swap info", () => {
    useBoltzSwapStore.getState().removeSwap(submarineSwap.id);
    expect(useBoltzSwapStore.getState().swaps).toEqual({
      [reverseSwap.id]: reverseSwap,
    });
  });
});
