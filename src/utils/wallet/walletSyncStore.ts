import { create } from "zustand";

type WalletSyncState = {
  // number of receive (external) addresses inspected so far during a full scan,
  // or null when no scan is in progress
  externalScanProgress: number | null;
  // number of change (internal) addresses inspected so far; stays null until the
  // external keychain is done and the scan moves on to change addresses
  internalScanProgress: number | null;
  setExternalScanProgress: (count: number | null) => void;
  setInternalScanProgress: (count: number | null) => void;
  resetScanProgress: () => void;
};

export const useWalletSyncStore = create<WalletSyncState>((set) => ({
  externalScanProgress: null,
  internalScanProgress: null,
  setExternalScanProgress: (externalScanProgress) =>
    set({ externalScanProgress }),
  setInternalScanProgress: (internalScanProgress) =>
    set({ internalScanProgress }),
  resetScanProgress: () =>
    set({ externalScanProgress: null, internalScanProgress: null }),
}));
