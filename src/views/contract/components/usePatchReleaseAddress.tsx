import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractKeys } from "../../../hooks/query/useContractDetail";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { peachAPI } from "../../../utils/peachAPI";

export const usePatchReleaseAddress = (
  offerId: string,
  contractId?: string,
) => {
  const queryClient = useQueryClient();
  const showErrorBanner = useShowErrorBanner();

  return useMutation({
    onMutate: async ({ releaseAddress }) => {
      await queryClient.cancelQueries({ queryKey: ["offer", offerId] });
      if (contractId)
        await queryClient.cancelQueries({
          queryKey: contractKeys.detail(contractId),
        });
      const previousOfferData = queryClient.getQueryData<BuyOffer | SellOffer>([
        "offer",
        offerId,
      ]);
      queryClient.setQueryData(
        ["offer", offerId],
        (oldQueryData: BuyOffer | SellOffer | undefined) =>
          oldQueryData && { ...oldQueryData, releaseAddress },
      );
      if (!contractId) return { previousOfferData };

      const previousContractData = queryClient.getQueryData<Contract>([
        "contract",
        contractId,
      ]);
      queryClient.setQueryData(
        contractKeys.detail(contractId),
        (oldQueryData: Contract | undefined) =>
          oldQueryData && {
            ...oldQueryData,
            releaseAddress,
          },
      );

      return { previousOfferData, previousContractData };
    },
    mutationFn: async (newData: {
      releaseAddress: string;
      messageSignature: string;
    }) => {
      const { error } = await peachAPI.private.offer.patchOffer({
        offerId,
        ...newData,
      });
      if (error) throw new Error(error.error);
    },
    onError: (err, _variables, context) => {
      queryClient.setQueryData(["offer", offerId], context?.previousOfferData);
      if (contractId)
        queryClient.setQueryData(
          contractKeys.detail(contractId),
          context?.previousContractData,
        );
      showErrorBanner(err.message);
    },
    onSettled: async () => {
      if (contractId) {
        await queryClient.invalidateQueries({
          queryKey: contractKeys.detail(contractId),
        });
      }
      return queryClient.invalidateQueries({ queryKey: ["offer", offerId] });
    },
  });
};
