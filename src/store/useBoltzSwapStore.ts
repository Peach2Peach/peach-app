import { SwapStatus } from "boltz-swap-web-context/src/boltz-api/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReverseAPIResponse } from "../utils/boltz/api/postReverseSubmarineSwap";
import { SubmarineAPIResponse } from "../utils/boltz/api/postSubmarineSwap";
import { omit } from "../utils/object/omit";
import { createStorage } from "../utils/storage/createStorage";
import { createPersistStorage } from "./createPersistStorage";

export const STATUS_MAP = {
  SUBMARINE: {
    COMPLETED: ["transaction.claimed"],
    CLAIM: ["transaction.claim.pending"],
    ERROR: [
      "transaction.lockupFailed",
      "swap.expired",
      "invoice.failedToPay",
      "transaction.failed",
      "transaction.zeroconf.rejected",
      "invoice.expired",
    ],
  },
  REVERSE: {
    COMPLETED: ["invoice.settled"],
    CLAIM: ["transaction.mempool", "transaction.confirmed"],
    ERROR: [
      "swap.expired",
      "invoice.failedToPay",
      "transaction.failed",
      "transaction.zeroconf.rejected",
      "invoice.expired",
    ],
  },
};
export type SwapInfo = (SubmarineAPIResponse | ReverseAPIResponse) & {
  status?: SwapStatus;
  keyPairIndex: number;
  preimage?: string;
};
export type WalletState = {
  swaps: Record<string, SwapInfo>;
  map: Record<string, string[]>;
};

export type WalletStore = WalletState & {
  reset: () => void;
  saveSwap: (swapInfo: SwapInfo) => void;
  mapSwap: (id: string, swapId: string) => void;
  getPending: () => SwapInfo[];
  removeSwap: (swapId: string) => void;
};

const defaultState: WalletState = {
  swaps: {},
  map: {},
};
export const boltzSwapStorage = createStorage("boltzSwap");
const storage = createPersistStorage(boltzSwapStorage);

export const getSwapType = (swap: SwapInfo) =>
  "expectedAmount" in swap ? "SUBMARINE" : "REVERSE";

export const getSwapAmount = (swap: SwapInfo) =>
  "onchainAmount" in swap
    ? swap.onchainAmount
    : "expectedAmount" in swap
      ? swap.expectedAmount
      : undefined;

export const isSwapPending = (swap: SwapInfo): boolean =>
  !swap.status?.status ||
  (!STATUS_MAP[getSwapType(swap)].COMPLETED.includes(swap.status.status) &&
    !STATUS_MAP[getSwapType(swap)].ERROR.includes(swap.status.status));

export const useBoltzSwapStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      reset: () => set(defaultState),
      saveSwap: (swapInfo) => {
        const swaps = get().swaps;
        swaps[swapInfo.id] = swapInfo;
        set({ swaps });
      },
      mapSwap: (id, swapId) => {
        const map = get().map;
        if (!map[id]) map[id] = [];
        if (!map[id].includes(swapId)) map[id].push(swapId);
        set({ map });
      },
      getPending: () => Object.values(get().swaps).filter(isSwapPending),
      removeSwap: (swapId) => {
        const swaps = get().swaps;
        set({ swaps: omit(swaps, swapId) });
      },
    }),
    {
      name: "boltz-swaps",
      version: 0,
      storage,
    },
  ),
);
