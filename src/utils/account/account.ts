import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const defaultLimits = {
  daily: 1000,
  dailyAmount: 0,
  monthlyAnonymous: 1000,
  monthlyAnonymousAmount: 0,
  yearly: 100000,
  yearlyAmount: 0,
};

export const defaultAccount: Account = {
  publicKey: "",
  tradingLimit: defaultLimits,
  chats: {},
  pgp: {
    privateKey: "",
    publicKey: "",
  },
};

type AccountStore = {
  account: Account;
  isLoggedIn: boolean;
  setAccount: (acc: Account) => void;
  setChat: (id: string, newChat: Account["chats"][string]) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const useAccountStore = create<AccountStore>()(
  immer((set) => ({
    account: defaultAccount,
    isLoggedIn: false,
    setAccount: (acc) => set({ account: acc }),
    setChat: (id, newChat) =>
      set((state) => {
        state.account.chats[id] = newChat;
      }),
    setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  })),
);

export const setAccount = useAccountStore.getState().setAccount;
