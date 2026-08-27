import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createPersistStorage } from "../../store/createPersistStorage";
import { createStorage } from "../storage/createStorage";

export type NymProxyConfig = {
  /** When true, wallet blockchain traffic is routed through the Nym mixnet. */
  enabled: boolean;
  /**
   * Allowed exit countries (ISO 3166-1 alpha-2, e.g. ["CH", "DE"]). When set, the
   * mixnet exit is restricted to these countries and auto-selected among them.
   * Empty = no country restriction.
   */
  countries: string[];
  /**
   * Nym address of a specific exit (network requester). Only used when
   * `countries` is empty; leave blank to auto-select an exit.
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
  countries: [],
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
