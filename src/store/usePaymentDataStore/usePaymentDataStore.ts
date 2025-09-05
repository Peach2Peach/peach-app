import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { deepMerge } from "../../utils/object/deepMerge";
import { omit } from "../../utils/object/omit";
import { dataToMeansOfPayment } from "../../utils/paymentMethod/dataToMeansOfPayment";
import { createStorage } from "../../utils/storage/createStorage";
import { isDefined } from "../../utils/validation/isDefined";
import { createPersistStorage } from "../createPersistStorage";
import { getHashedPaymentData } from "../offerPreferenes/helpers/getHashedPaymentData";
import { useOfferPreferences } from "../offerPreferenes/useOfferPreferences";
import { buildPaymentDetailInfo } from "./helpers/buildPaymentDetailInfo";
import { removeHashesFromPaymentDetailInfo } from "./helpers/removeHashesFromPaymentDetailInfo";
import { PaymentDetailInfo } from "./types";

type PaymentDataState = {
  paymentData: Record<string, PaymentData>;
  paymentDetailInfo: PaymentDetailInfo;
};
export type PaymentMethodsStore = PaymentDataState & {
  reset: () => void;
  addPaymentData: (data: PaymentData) => void;
  setPaymentDataHidden: (id: string, hidden: boolean) => void;
  removePaymentData: (id: string) => void;
};
const storeId = "paymentDataStore";
const paymentDataStorage = createStorage(storeId);
const storage = createPersistStorage<PaymentMethodsStore>(paymentDataStorage);

export const defaultPaymentDataStore: PaymentDataState = {
  paymentData: {},
  paymentDetailInfo: {},
};

export const usePaymentDataStore = create<PaymentMethodsStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        ...defaultPaymentDataStore,
        reset: () => set(defaultPaymentDataStore),
        addPaymentData: (data) => {
          const newPamentDetailInfo = buildPaymentDetailInfo(data);
          set((state) => ({
            paymentData: { ...state.paymentData, [data.id]: data },
            paymentDetailInfo: deepMerge(
              state.paymentDetailInfo,
              newPamentDetailInfo,
            ),
          }));
        },
        setPaymentDataHidden: (id, hidden) => {
          const data = get().paymentData[id];
          if (!data) return;
          set((state) => ({
            paymentData: {
              ...state.paymentData,
              [data.id]: { ...data, hidden },
            },
          }));
        },
        removePaymentData: (id) => {
          const data = get().paymentData[id];
          if (!data) return;

          set((state) => ({
            paymentData: omit(state.paymentData, id),
            paymentDetailInfo: removeHashesFromPaymentDetailInfo(
              state.paymentDetailInfo,
              data,
            ),
          }));
        },
      }),
      {
        name: storeId,
        version: 0,
        storage,
      },
    ),
  ),
);

usePaymentDataStore.subscribe(
  (state) => state.paymentData, // only listen for paymentData changes
  (paymentData) => {
    const selectedIds = Object.values(
      useOfferPreferences.getState().preferredPaymentMethods,
    ).filter(isDefined);

    const originalPaymentData = selectedIds
      .map((id) => paymentData[id])
      .filter(isDefined);

    const meansOfPayment = originalPaymentData.reduce(dataToMeansOfPayment, {});

    const hashedPaymentData = getHashedPaymentData(originalPaymentData);

    useOfferPreferences.setState({
      originalPaymentData,
      meansOfPayment,
      paymentData: hashedPaymentData,
    });
  },
);
