import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistStorage } from "../../store/createPersistStorage";
import { createStorage } from "../storage/createStorage";

export type NymProxyConfig = {
  /** When true, wallet blockchain traffic is routed through the Nym mixnet. */
  enabled: boolean;
  /**
   * Nym address of the SOCKS5 exit (network requester / exit gateway) that makes
   * the outbound TCP connection to the configured node on our behalf.
   */
  serviceProvider: string;
};

export type NymProxyStore = NymProxyConfig & {
  reset: () => void;
  setConfig: (config: Partial<NymProxyConfig>) => void;
  toggleEnabled: () => void;
};

export const defaultNymProxyConfig: NymProxyConfig = {
  enabled: false,
  serviceProvider: "",
};

export const nymProxyStorage = createStorage("nymProxy");
const storage = createPersistStorage(nymProxyStorage);

export const useNymProxyState = create<NymProxyStore>()(
  persist(
    (set, get) => ({
      ...defaultNymProxyConfig,
      reset: () => set(() => defaultNymProxyConfig),
      setConfig: (config) => set(config),
      toggleEnabled: () => set({ enabled: !get().enabled }),
    }),
    {
      name: "nymProxy",
      version: 0,
      storage,
    },
  ),
);
