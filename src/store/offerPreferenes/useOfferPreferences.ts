import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MatchFilter } from "../../../peach-api/src/@types/api/offerAPI";
import { NEW_USER_TRADE_THRESHOLD } from "../../constants";
import { getSelectedPaymentDataIds } from "../../utils/account/getSelectedPaymentDataIds";
import { createStorage } from "../../utils/storage/createStorage";
import { MIN_REPUTATION_FILTER } from "../../views/offerPreferences/components/MIN_REPUTATION_FILTER";
import { createPersistStorage } from "../createPersistStorage";
import {
  getHashedPaymentData,
  getMeansOfPayment,
  getOriginalPaymentData,
  getPreferredMethods,
} from "./helpers";
import { CurrencyType } from "./types";

type OfferPreferences = {
  //peach069
  createBuyOfferAmount: number;
  createBuyOfferPremium: number;
  expressBuyFilterByAmountRange: [number, number];
  expressSellFilterByAmountRange: [number, number];

  expressBuyFilterByCurrencyList: Currency[];
  expressSellFilterByCurrencyList: Currency[];

  expressBuyFilterByPaymentMethodList: PaymentMethodInfo[];
  expressSellFilterByPaymentMethodList: PaymentMethodInfo[];

  expressSellFilterMinPremium: number;
  expressBuyFilterMaxPremium: number;

  buyAmountRange: [number, number];
  sellAmount: number;
  premium: number;
  meansOfPayment: MeansOfPayment;
  paymentData: OfferPaymentData;
  preferredPaymentMethods: Partial<Record<PaymentMethod, string>>;
  originalPaymentData: PaymentData[];
  preferredCurrenyType: CurrencyType;
  multi?: number;
  buyOfferMulti?: number;
  sortBy: {
    buyOffer: BuySorter[];
    sellOffer: SellSorter[];
  };
  filter: {
    buyOffer: Required<MatchFilter> & {
      shouldApplyMaxPremium: boolean;
    };
  };
  instantTrade: boolean;
  instantTradeCriteria: InstantTradeCriteria;
  hasSeenInstantTradePopup: boolean;
  fundWithPeachWallet: boolean;
};

export const defaultPreferences: OfferPreferences = {
  createBuyOfferAmount: 1,
  createBuyOfferPremium: 1.5,

  buyAmountRange: [20000, 1090000], //TODO: verify this
  expressBuyFilterByAmountRange: [20000, 1090000],
  expressSellFilterByAmountRange: [20000, 1090000],
  expressBuyFilterByCurrencyList: [],
  expressSellFilterByCurrencyList: [],
  expressBuyFilterByPaymentMethodList: [],
  expressSellFilterByPaymentMethodList: [],
  expressSellFilterMinPremium: -21, // TODO: replace hardcoded value with constant
  expressBuyFilterMaxPremium: 21, // TODO: replace hardcoded value with constant
  sellAmount: 1,
  premium: 1.5,
  meansOfPayment: {},
  paymentData: {},
  preferredPaymentMethods: {},
  originalPaymentData: [],
  multi: undefined,
  buyOfferMulti: undefined,
  preferredCurrenyType: "europe",
  sortBy: {
    buyOffer: ["bestReputation"],
    sellOffer: ["bestReputation"],
  },
  filter: {
    buyOffer: {
      maxPremium: null,
      minReputation: null,
      shouldApplyMaxPremium: false,
    },
  },
  instantTrade: false,
  instantTradeCriteria: {
    minReputation: 0,
    minTrades: 0,
    badges: [],
  },
  hasSeenInstantTradePopup: false,
  fundWithPeachWallet: false,
};

type OfferPreferencesActions = {
  setCreateBuyOfferAmount: (createBuyOfferAmount: number) => void;
  setCreateBuyOfferPremium: (createBuyOfferPremium: number) => void;
  setBuyAmountRange: (buyAmountRange: [number, number]) => void;
  setExpressBuyFilterByAmountRange: (
    expressBuyFilterByAmountRange: [number, number],
  ) => void;
  setExpressSellFilterByAmountRange: (
    expressSellFilterByAmountRange: [number, number],
  ) => void;
  setExpressBuyFilterByCurrencyList: (
    expressBuyFilterByCurrencyList: Currency[],
  ) => void;
  setExpressSellFilterByCurrencyList: (
    expressSellFilterByCurrencyList: Currency[],
  ) => void;
  setExpressBuyFilterByPaymentMethodList: (
    expressBuyFilterByPaymentMethodList: PaymentMethodInfo[],
  ) => void;
  setExpressSellFilterByPaymentMethodList: (
    expressSellFilterByPaymentMethodList: PaymentMethodInfo[],
  ) => void;
  setExpressBuyFilterMaxPremium: (expressBuyFilterMaxPremium: number) => void;
  setExpressSellFilterMinPremium: (expressSellFilterMinPremium: number) => void;
  setSellAmount: (sellAmount: number) => void;
  setMulti: (number?: number) => void;
  setBuyOfferMulti: (number?: number) => void;
  setPremium: (newPremium: number, isValid?: boolean) => void;
  setPaymentMethods: (ids: string[]) => void;
  selectPaymentMethod: (id: string) => void;
  setPreferredCurrencyType: (preferredCurrenyType: CurrencyType) => void;
  setBuyOfferSorter: (sorter: BuySorter) => void;
  setSellOfferSorter: (sorter: SellSorter) => void;
  toggleInstantTrade: () => void;
  toggleMinTrades: () => void;
  toggleMinReputation: () => void;
  toggleBadge: (badge: Medal) => void;
  setHasSeenInstantTradePopup: (hasSeenInstantTradePopup: boolean) => void;
  setFundWithPeachWallet: (fundWithPeachWallet: boolean) => void;
};

type OfferPreferencesStore = OfferPreferences & OfferPreferencesActions;

export const offerPreferencesStorage = createStorage("offerPreferences");
const storage = createPersistStorage(offerPreferencesStorage);

export const useOfferPreferences = create<OfferPreferencesStore>()(
  persist(
    immer((set, get) => ({
      ...defaultPreferences,
      setCreateBuyOfferAmount: (createBuyOfferAmount) =>
        set({ createBuyOfferAmount }),
      setCreateBuyOfferPremium: (createBuyOfferPremium) =>
        set({ createBuyOfferPremium }),

      setBuyAmountRange: (buyAmountRange) => set({ buyAmountRange }),
      setExpressBuyFilterByAmountRange: (expressBuyFilterByAmountRange) =>
        set({ expressBuyFilterByAmountRange }),
      setExpressSellFilterByAmountRange: (expressSellFilterByAmountRange) =>
        set({ expressSellFilterByAmountRange }),

      setExpressBuyFilterByCurrencyList: (expressBuyFilterByCurrencyList) =>
        set({ expressBuyFilterByCurrencyList }),
      setExpressSellFilterByCurrencyList: (expressSellFilterByCurrencyList) =>
        set({ expressSellFilterByCurrencyList }),

      setExpressBuyFilterByPaymentMethodList: (
        expressBuyFilterByPaymentMethodList,
      ) => set({ expressBuyFilterByPaymentMethodList }),
      setExpressSellFilterByPaymentMethodList: (
        expressSellFilterByPaymentMethodList,
      ) => set({ expressSellFilterByPaymentMethodList }),

      setExpressBuyFilterMaxPremium: (expressBuyFilterMaxPremium: number) =>
        set({ expressBuyFilterMaxPremium }),
      setExpressSellFilterMinPremium: (expressSellFilterMinPremium: number) =>
        set({ expressSellFilterMinPremium }),

      setSellAmount: (sellAmount) => set({ sellAmount }),
      setMulti: (multi) => set({ multi }),
      setBuyOfferMulti: (buyOfferMulti) => set({ buyOfferMulti }),
      setPremium: (premium) => set({ premium }),
      setPaymentMethods: (ids) => {
        const preferredPaymentMethods = getPreferredMethods(ids);
        const originalPaymentData = getOriginalPaymentData(
          preferredPaymentMethods,
        );
        const meansOfPayment = getMeansOfPayment(originalPaymentData);
        const paymentData = getHashedPaymentData(originalPaymentData);

        set({
          preferredPaymentMethods,
          meansOfPayment,
          paymentData,
          originalPaymentData,
        });
      },
      selectPaymentMethod: (id: string) => {
        const selectedPaymentDataIds = getSelectedPaymentDataIds(
          get().preferredPaymentMethods,
        );
        if (selectedPaymentDataIds.includes(id)) {
          get().setPaymentMethods(
            selectedPaymentDataIds.filter((v) => v !== id),
          );
        } else {
          get().setPaymentMethods([...selectedPaymentDataIds, id]);
        }
      },
      setPreferredCurrencyType: (preferredCurrenyType) =>
        set({ preferredCurrenyType }),
      setBuyOfferSorter: (sorter) =>
        set((state) => {
          state.sortBy.buyOffer = [sorter];
        }),
      setSellOfferSorter: (sorter) =>
        set((state) => {
          state.sortBy.sellOffer = [sorter];
        }),
      toggleInstantTrade: () =>
        set((state) => ({ instantTrade: !state.instantTrade })),
      toggleMinTrades: () =>
        set((state) => {
          state.instantTradeCriteria.minTrades =
            state.instantTradeCriteria.minTrades === 0
              ? NEW_USER_TRADE_THRESHOLD
              : 0;
        }),
      toggleMinReputation: () =>
        set((state) => {
          state.instantTradeCriteria.minReputation =
            state.instantTradeCriteria.minReputation === 0
              ? MIN_REPUTATION_FILTER
              : 0;
        }),
      toggleBadge: (badge: Medal) =>
        set((state) => {
          const badges = state.instantTradeCriteria.badges;
          if (badges.includes(badge)) {
            badges.splice(badges.indexOf(badge), 1);
          } else {
            badges.push(badge);
          }
        }),
      setHasSeenInstantTradePopup: (hasSeenInstantTradePopup) =>
        set({ hasSeenInstantTradePopup }),
      setFundWithPeachWallet: (fundWithPeachWallet) =>
        set({ fundWithPeachWallet }),
    })),
    {
      name: "offerPreferences",
      version: 0,
      storage,
    },
  ),
);
