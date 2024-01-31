import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MatchFilter } from "../../../peach-api/src/@types/api/offerAPI";
import { NEW_USER_TRADE_THRESHOLD, TOTAL_SATS } from "../../constants";
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
  buyAmountRange: [number, number];
  sellAmount: number;
  premium: number;
  meansOfPayment: MeansOfPayment;
  paymentData: OfferPaymentData;
  preferredPaymentMethods: Partial<Record<PaymentMethod, string>>;
  originalPaymentData: PaymentData[];
  preferredCurrenyType: CurrencyType;
  multi?: number;
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
};

export const defaultPreferences: OfferPreferences = {
  buyAmountRange: [1, TOTAL_SATS],
  sellAmount: 1,
  premium: 1.5,
  meansOfPayment: {},
  paymentData: {},
  preferredPaymentMethods: {},
  originalPaymentData: [],
  multi: undefined,
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
};

type OfferPreferencesActions = {
  setBuyAmountRange: (buyAmountRange: [number, number]) => void;
  setSellAmount: (sellAmount: number) => void;
  setMulti: (number?: number) => void;
  setPremium: (newPremium: number, isValid?: boolean) => void;
  setPaymentMethods: (ids: string[]) => void;
  selectPaymentMethod: (id: string) => void;
  setPreferredCurrencyType: (preferredCurrenyType: CurrencyType) => void;
  setBuyOfferSorter: (sorter: BuySorter) => void;
  setSellOfferSorter: (sorter: SellSorter) => void;
  setBuyOfferFilter: (filter: MatchFilter) => void;
  setMaxPremiumFilter: (maxPremium: number | null) => void;
  toggleShouldApplyMaxPremium: () => void;
  toggleMinReputationFilter: () => void;
  setMinReputationFilter: (minReputation: number | null) => void;
  toggleInstantTrade: () => void;
  toggleMinTrades: () => void;
  toggleMinReputation: () => void;
  toggleBadge: (badge: Medal) => void;
  setHasSeenInstantTradePopup: (hasSeenInstantTradePopup: boolean) => void;
};

type OfferPreferencesStore = OfferPreferences & OfferPreferencesActions;

export const offerPreferencesStorage = createStorage("offerPreferences");
const storage = createPersistStorage(offerPreferencesStorage);

export const useOfferPreferences = create<OfferPreferencesStore>()(
  persist(
    // eslint-disable-next-line max-lines-per-function
    immer((set, get) => ({
      ...defaultPreferences,
      setBuyAmountRange: (buyAmountRange) => set({ buyAmountRange }),
      setSellAmount: (sellAmount) => set({ sellAmount }),
      setMulti: (multi) => set({ multi }),
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
      setBuyOfferFilter: (filter) =>
        set((state) => {
          state.filter.buyOffer = {
            ...state.filter.buyOffer,
            ...filter,
          };
        }),
      setMaxPremiumFilter: (maxPremium) =>
        set((state) => {
          state.filter.buyOffer.maxPremium = maxPremium;
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
      toggleShouldApplyMaxPremium: () =>
        set((state) => {
          state.filter.buyOffer.shouldApplyMaxPremium =
            !state.filter.buyOffer.shouldApplyMaxPremium;
        }),
      toggleMinReputationFilter: () =>
        set((state) => {
          state.filter.buyOffer.minReputation =
            state.filter.buyOffer.minReputation === null
              ? MIN_REPUTATION_FILTER
              : null;
        }),
      setMinReputationFilter: (minReputation) =>
        set((state) => {
          state.filter.buyOffer.minReputation = minReputation;
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
    })),
    {
      name: "offerPreferences",
      version: 0,
      storage,
    },
  ),
);
