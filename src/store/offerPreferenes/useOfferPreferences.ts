import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MatchFilter } from "../../../peach-api/src/@types/api/offerAPI";
import { NEW_USER_TRADE_THRESHOLD, TOTAL_SATS } from "../../constants";
import { dataToMeansOfPayment } from "../../utils/paymentMethod/dataToMeansOfPayment";
import { createStorage } from "../../utils/storage/createStorage";
import { isDefined } from "../../utils/validation/isDefined";
import { MIN_REPUTATION_FILTER } from "../../views/offerPreferences/components/MIN_REPUTATION_FILTER";
import { createPersistStorage } from "../createPersistStorage";
import { usePaymentDataStore } from "../usePaymentDataStore";
import { getHashedPaymentData, getPreferredMethods } from "./helpers";
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
  multiOfferList: string[][];
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
  buyAmountRange: [1, TOTAL_SATS],
  sellAmount: 1,
  premium: 1.5,
  meansOfPayment: {},
  paymentData: {},
  preferredPaymentMethods: {},
  originalPaymentData: [],
  multi: undefined,
  multiOfferList: [],
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
  setBuyAmountRange: (buyAmountRange: [number, number]) => void;
  setSellAmount: (sellAmount: number) => void;
  setMulti: (number?: number) => void;
  addMultiOffers: (offers: string[]) => void;
  removeMultiOffer: (offer: string) => void;
  setPremium: (newPremium: number, isValid?: boolean) => void;
  setPaymentMethods: (ids: string[]) => void;
  togglePaymentMethod: (id: string) => void;
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
      setBuyAmountRange: (buyAmountRange) => set({ buyAmountRange }),
      setSellAmount: (sellAmount) => set({ sellAmount }),
      setMulti: (multi) => set({ multi }),
      addMultiOffers: (offers) => {
        set({
          multiOfferList: [...get().multiOfferList, offers],
        });
      },
      removeMultiOffer: (offer) => {
        const multiOffers = get().multiOfferList.filter(
          (o) => !o.includes(offer),
        );
        const newMultiOfferList = get()
          .multiOfferList.find((o) => o.includes(offer))
          ?.filter((o) => o !== offer);

        if (newMultiOfferList) {
          if (newMultiOfferList.length > 1) {
            set({
              multiOfferList: multiOffers.concat([newMultiOfferList]),
            });
          } else {
            set({
              multiOfferList: multiOffers,
            });
          }
        }
      },
      setPremium: (premium) => set({ premium }),
      setPaymentMethods: (ids) => {
        const preferredPaymentMethods = getPreferredMethods(ids);
        const originalPaymentData = Object.values(preferredPaymentMethods)
          .filter(isDefined)
          .map((id) => usePaymentDataStore.getState().paymentData[id])
          .filter(isDefined);
        const meansOfPayment = originalPaymentData.reduce(
          dataToMeansOfPayment,
          {},
        );
        const paymentData = getHashedPaymentData(originalPaymentData);

        set({
          preferredPaymentMethods,
          meansOfPayment,
          paymentData,
          originalPaymentData,
        });
      },
      togglePaymentMethod: (id) => {
        const selectedPaymentDataIds = Object.values(
          get().preferredPaymentMethods,
        ).filter(isDefined);
        if (selectedPaymentDataIds.includes(id)) {
          get().setPaymentMethods(
            selectedPaymentDataIds.filter((v) => v !== id),
          );
        } else {
          get().setPaymentMethods([...selectedPaymentDataIds, id]);
        }
      },
      selectPaymentMethod: (id) => {
        const selectedPaymentDataIds = Object.values(
          get().preferredPaymentMethods,
        ).filter(isDefined);
        if (selectedPaymentDataIds.includes(id)) return;
        get().setPaymentMethods([...selectedPaymentDataIds, id]);
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
      toggleBadge: (badge) =>
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
