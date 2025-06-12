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

export type BuySorter = "highestAmount" | "lowestPremium" | "bestReputation";
export type SellSorter = "highestPrice" | "bestReputation";
type OfferPreferences = {
  buyAmountRange: [number, number];
  sellAmount: number;
  premium: number; // for Sell
  buyPremium: number;
  meansOfPayment: MeansOfPayment;
  meansOfPaymentOnExpressBuyFilter: MeansOfPayment;
  meansOfPaymentOnExpressSellFilter: MeansOfPayment;
  paymentData: OfferPaymentData;
  paymentDataOnExpressBuyFilter: OfferPaymentData;
  paymentDataOnExpressSellFilter: OfferPaymentData;
  preferredPaymentMethodsOnExpressBuyFilter: Partial<
    Record<PaymentMethod, string>
  >;
  preferredPaymentMethodsOnExpressSellFilter: Partial<
    Record<PaymentMethod, string>
  >;
  preferredPaymentMethods: Partial<Record<PaymentMethod, string>>;
  originalPaymentData: PaymentData[];
  originalPaymentDataOnExpressBuyFilter: PaymentData[];
  originalPaymentDataOnExpressSellFilter: PaymentData[];
  preferredCurrenyType: CurrencyType;
  buyMultiOffers?: number;
  sellMultiOffers?: number;
  sortBy: {
    buyOffer: BuySorter[];
    sellOffer: SellSorter[];
  };
  filter: {
    buyOffer: Required<MatchFilter> & {
      shouldApplyMaxPremium: boolean;
    };
  };

  buyInstantTrade: boolean;
  buyInstantTradeCriteria: InstantTradeCriteria;
  sellInstantTrade: boolean;
  sellInstantTradeCriteria: InstantTradeCriteria;

  hasSeenInstantTradePopup: boolean;
  fundWithPeachWallet: boolean;
};

export const defaultPreferences: OfferPreferences = {
  buyAmountRange: [1, TOTAL_SATS],
  sellAmount: 1,
  premium: 1.5,
  buyPremium: 21,
  meansOfPayment: {},
  meansOfPaymentOnExpressBuyFilter: {},
  meansOfPaymentOnExpressSellFilter: {},
  paymentData: {},
  paymentDataOnExpressBuyFilter: {},
  paymentDataOnExpressSellFilter: {},
  preferredPaymentMethods: {},
  preferredPaymentMethodsOnExpressBuyFilter: {},
  preferredPaymentMethodsOnExpressSellFilter: {},
  originalPaymentData: [],
  originalPaymentDataOnExpressBuyFilter: [],
  originalPaymentDataOnExpressSellFilter: [],
  buyMultiOffers: undefined,
  sellMultiOffers: undefined,
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
  buyInstantTrade: false,
  buyInstantTradeCriteria: {
    minReputation: 0,
    minTrades: 0,
    badges: [],
  },
  sellInstantTrade: false,
  sellInstantTradeCriteria: {
    minReputation: 0,
    minTrades: 0,
    badges: [],
  },
  hasSeenInstantTradePopup: false,
  fundWithPeachWallet: false,
};

type OfferPreferencesActions = {
  setBuyAmountRange: (buyAmountRange: [number, number]) => void;
  setSellAmount: (sellAmount: number) => void;
  setBuyMultiOffers: (number?: number) => void;
  setSellMultiOffers: (number?: number) => void;
  setPremium: (newPremium: number, isValid?: boolean) => void; // for Sell
  setBuyPremium: (newPremium: number, isValid?: boolean) => void; // for Buy
  setPaymentMethods: (ids: string[]) => void;
  setPaymentMethodsOfExpressBuyFilter: (ids: string[]) => void;
  setPaymentMethodsOfExpressSellFilter: (ids: string[]) => void;
  selectPaymentMethod: (id: string, filterSelection?: "buy" | "sell") => void;
  setPreferredCurrencyType: (preferredCurrenyType: CurrencyType) => void;
  setBuyOfferSorter: (sorter: BuySorter) => void;
  setSellOfferSorter: (sorter: SellSorter) => void;
  toggleBuyInstantTrade: () => void;
  toggleSellInstantTrade: () => void;
  toggleBuyMinTrades: () => void;
  toggleBuyMinReputation: () => void;
  toggleBuyBadge: (badge: Medal) => void;
  toggleSellMinTrades: () => void;
  toggleSellMinReputation: () => void;
  toggleSellBadge: (badge: Medal) => void;
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
      setBuyAmountRange: (buyAmountRange) => set({ buyAmountRange }),
      setSellAmount: (sellAmount) => set({ sellAmount }),
      setBuyMultiOffers: (buyMultiOffers) => set({ buyMultiOffers }),
      setSellMultiOffers: (sellMultiOffers) => set({ sellMultiOffers }),
      setPremium: (premium) => set({ premium }),
      setBuyPremium: (buyPremium) => set({ buyPremium }),
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
      setPaymentMethodsOfExpressBuyFilter: (ids) => {
        const preferredPaymentMethodsOnExpressBuyFilter =
          getPreferredMethods(ids);
        const originalPaymentDataOnExpressBuyFilter = getOriginalPaymentData(
          preferredPaymentMethodsOnExpressBuyFilter,
        );
        const meansOfPaymentOnExpressBuyFilter = getMeansOfPayment(
          originalPaymentDataOnExpressBuyFilter,
        );
        const paymentDataOnExpressBuyFilter = getHashedPaymentData(
          originalPaymentDataOnExpressBuyFilter,
        );

        set({
          preferredPaymentMethodsOnExpressBuyFilter,
          meansOfPaymentOnExpressBuyFilter,
          paymentDataOnExpressBuyFilter,
          originalPaymentDataOnExpressBuyFilter,
        });
      },
      setPaymentMethodsOfExpressSellFilter: (ids) => {
        const preferredPaymentMethodsOnExpressSellFilter =
          getPreferredMethods(ids);
        const originalPaymentDataOnExpressSellFilter = getOriginalPaymentData(
          preferredPaymentMethodsOnExpressSellFilter,
        );
        const meansOfPaymentOnExpressSellFilter = getMeansOfPayment(
          originalPaymentDataOnExpressSellFilter,
        );
        const paymentDataOnExpressSellFilter = getHashedPaymentData(
          originalPaymentDataOnExpressSellFilter,
        );

        set({
          preferredPaymentMethodsOnExpressSellFilter,
          meansOfPaymentOnExpressSellFilter,
          paymentDataOnExpressSellFilter,
          originalPaymentDataOnExpressSellFilter,
        });
      },
      selectPaymentMethod: (id: string, filterSelection?: "buy" | "sell") => {
        const selectedPaymentDataIds = filterSelection
          ? filterSelection === "buy"
            ? getSelectedPaymentDataIds(
                get().preferredPaymentMethodsOnExpressBuyFilter,
              )
            : getSelectedPaymentDataIds(
                get().preferredPaymentMethodsOnExpressSellFilter,
              )
          : getSelectedPaymentDataIds(get().preferredPaymentMethods);

        const newSelectedPaymentDataIds = selectedPaymentDataIds.includes(id)
          ? selectedPaymentDataIds.filter((v) => v !== id)
          : [...selectedPaymentDataIds, id];

        if (filterSelection === undefined) {
          get().setPaymentMethods(newSelectedPaymentDataIds);
        } else if (filterSelection === "buy") {
          get().setPaymentMethodsOfExpressBuyFilter(newSelectedPaymentDataIds);
        } else if (filterSelection === "sell") {
          get().setPaymentMethodsOfExpressSellFilter(newSelectedPaymentDataIds);
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

      toggleBuyInstantTrade: () =>
        set((state) => ({ buyInstantTrade: !state.buyInstantTrade })),
      toggleSellInstantTrade: () =>
        set((state) => ({ sellInstantTrade: !state.sellInstantTrade })),

      toggleBuyMinTrades: () =>
        set((state) => {
          state.buyInstantTradeCriteria.minTrades =
            state.buyInstantTradeCriteria.minTrades === 0
              ? NEW_USER_TRADE_THRESHOLD
              : 0;
        }),
      toggleBuyMinReputation: () =>
        set((state) => {
          state.buyInstantTradeCriteria.minReputation =
            state.buyInstantTradeCriteria.minReputation === 0
              ? MIN_REPUTATION_FILTER
              : 0;
        }),
      toggleBuyBadge: (badge: Medal) =>
        set((state) => {
          const badges = state.buyInstantTradeCriteria.badges;
          if (badges.includes(badge)) {
            badges.splice(badges.indexOf(badge), 1);
          } else {
            badges.push(badge);
          }
        }),

      toggleSellMinTrades: () =>
        set((state) => {
          state.sellInstantTradeCriteria.minTrades =
            state.sellInstantTradeCriteria.minTrades === 0
              ? NEW_USER_TRADE_THRESHOLD
              : 0;
        }),
      toggleSellMinReputation: () =>
        set((state) => {
          state.sellInstantTradeCriteria.minReputation =
            state.sellInstantTradeCriteria.minReputation === 0
              ? MIN_REPUTATION_FILTER
              : 0;
        }),
      toggleSellBadge: (badge: Medal) =>
        set((state) => {
          const badges = state.sellInstantTradeCriteria.badges;
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
