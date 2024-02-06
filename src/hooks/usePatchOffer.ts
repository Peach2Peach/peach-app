import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatchFilter } from "../../peach-api/src/@types/api/offerAPI";
import { peachAPI } from "../utils/peachAPI";
import { offerKeys } from "./query/useOfferDetail";
import { useShowErrorBanner } from "./useShowErrorBanner";

export type PatchOfferData = {
  refundAddress?: string;
  refundTx?: string;
  premium?: number;
} & Partial<MatchFilter>;

export const usePatchOffer = () => {
  const queryClient = useQueryClient();
  const showErrorBanner = useShowErrorBanner();

  return useMutation({
    onMutate: async ({ offerId, newData }) => {
      await queryClient.cancelQueries({ queryKey: offerKeys.detail(offerId) });
      const previousData = queryClient.getQueryData<BuyOffer | SellOffer>(
        offerKeys.detail(offerId),
      );
      queryClient.setQueryData<BuyOffer | SellOffer>(
        offerKeys.detail(offerId),
        (oldQueryData) => oldQueryData && { ...oldQueryData, ...newData },
      );

      return { previousData };
    },
    mutationFn: async ({
      offerId,
      newData,
    }: {
      offerId: string;
      newData: PatchOfferData;
    }) => {
      const { error } = await peachAPI.private.offer.patchOffer({
        offerId,
        ...newData,
      });
      if (error) throw new Error(error.error);
    },
    onError: (err, { offerId }, context) => {
      queryClient.setQueryData(
        offerKeys.detail(offerId),
        context?.previousData,
      );
      showErrorBanner(err.message);
    },
    onSettled: (_data, _error, { offerId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: offerKeys.detail(offerId) }),
        queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
      ]),
  });
};

export type PatchBuyOfferData = {
  amount?: [number, number];
} & Partial<MatchFilter>;

export const usePatchBuyOffer = () => {
  const queryClient = useQueryClient();
  const showErrorBanner = useShowErrorBanner();

  return useMutation({
    onMutate: async ({ offerId, newData }) => {
      await queryClient.cancelQueries({ queryKey: offerKeys.detail(offerId) });
      const previousData = queryClient.getQueryData<BuyOffer>(
        offerKeys.detail(offerId),
      );
      queryClient.setQueryData<BuyOffer>(
        offerKeys.detail(offerId),
        (oldQueryData) => oldQueryData && { ...oldQueryData, ...newData },
      );

      return { previousData };
    },
    mutationFn: async ({
      offerId,
      newData,
    }: {
      offerId: string;
      newData: PatchBuyOfferData;
    }) => {
      const { error } = await peachAPI.private.offer.patchOffer({
        offerId,
        ...newData,
      });
      if (error) throw new Error(error.error);
    },
    onError: (err, { offerId }, context) => {
      queryClient.setQueryData(
        offerKeys.detail(offerId),
        context?.previousData,
      );
      showErrorBanner(err.message);
    },
    onSettled: (_data, _error, { offerId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: offerKeys.detail(offerId) }),
        queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
      ]),
  });
};
