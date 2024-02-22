import { useMutation, useQueryClient } from "@tanstack/react-query";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { useShowErrorBanner } from "../../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { peachAPI } from "../../../utils/peachAPI";

export const useConfirmEscrow = () => {
  const navigation = useStackNavigation();
  const showErrorBanner = useShowErrorBanner();
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: async ({ offerId }) => {
      await queryClient.cancelQueries({
        queryKey: offerKeys.fundingStatus(offerId),
      });
      const previousData = queryClient.getQueryData<FundingStatusResponse>(
        offerKeys.fundingStatus(offerId),
      );
      if (previousData) {
        queryClient.setQueryData(
          offerKeys.fundingStatus(offerId),
          (oldQueryData: FundingStatusResponse | undefined) =>
            oldQueryData && {
              ...oldQueryData,
              userConfirmationRequired: false,
            },
        );
      }
      return { previousData };
    },
    mutationFn: confirmEscrow,
    onError: (error, { offerId }, context) => {
      showErrorBanner(error.message);
      queryClient.setQueryData(
        offerKeys.fundingStatus(offerId),
        context?.previousData,
      );
    },
    onSuccess: (_data, { offerId, funding }) => {
      const destination = funding.status === "FUNDED" ? "search" : "fundEscrow";
      navigation.reset({
        index: 1,
        routes: [
          { name: "homeScreen", params: { screen: "yourTrades" } },
          { name: destination, params: { offerId } },
        ],
      });
    },
    onSettled: (_data, _error, { offerId }) =>
      queryClient.invalidateQueries({
        queryKey: offerKeys.fundingStatus(offerId),
      }),
  });
};

async function confirmEscrow({
  offerId,
}: {
  offerId: string;
  funding: FundingStatus;
}) {
  const { result, error } = await peachAPI.private.offer.confirmEscrow({
    offerId,
  });
  if (!result) {
    throw new Error(error?.error || "Failed to confirm escrow");
  }
  return result;
}
