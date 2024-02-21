import { ReverseResponse, SubmarineResponse } from "boltz-swap-web-context/src/boltz-api/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createStorage } from "../utils/storage/createStorage";
import { createPersistStorage } from "./createPersistStorage";

export type WalletState = {
  swaps: Record<string, (SubmarineResponse | ReverseResponse)[]>
};

export type WalletStore = WalletState & {
  saveSwap: (id: string, swapInfo: SubmarineResponse | ReverseResponse) => void;
  removeSwap: (id: string, swapId: string) => void;
};

const defaultState: WalletState = {
  swaps: {}
};
export const boltzSwapStorage = createStorage("boltzSwap");
const storage = createPersistStorage(boltzSwapStorage);

export const useBoltzSwapStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      saveSwap: (id, swapInfo) => {
        const swaps = get().swaps
        if (!swaps[id]) swaps[id] = []
        if (!swaps[id].some(swap => swap.id === swapInfo.id)) swaps[id].push(swapInfo)
        set({ swaps })
      },
      removeSwap: (id, swapId) => {
        const swaps = get().swaps
        if (!swaps[id]) return
        swaps[id] = swaps[id].filter(swap => swap.id !== swapId)
        set({ swaps })
      },
    }),
    {
      name: "boltz-swaps",
      version: 0,
      storage,
    },
  ),
);
