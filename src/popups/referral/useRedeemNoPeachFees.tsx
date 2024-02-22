import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../../../peach-api/src/@types/user";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { userKeys } from "../../hooks/query/useSelfUser";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import {
  NUMBER_OF_FREE_TRADES,
  POINTS_PER_FREE_TRADE,
} from "../../views/referrals/constants";

export function useRedeemNoPeachFees() {
  const queryClient = useQueryClient();
  const showErrorBanner = useShowErrorBanner();
  const setPopup = useSetPopup();
  return useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKeys.self() });
      const previousData = queryClient.getQueryData(userKeys.self());
      queryClient.setQueryData<User>(userKeys.self(), (old) => {
        if (!old) return old;
        return {
          ...old,
          freeTrades: (old?.freeTrades || 0) + NUMBER_OF_FREE_TRADES,
          maxFreeTrades: (old?.maxFreeTrades || 0) + NUMBER_OF_FREE_TRADES,
          bonusPoints:
            (old?.bonusPoints || 0) -
            POINTS_PER_FREE_TRADE * NUMBER_OF_FREE_TRADES,
        };
      });
      return { previousData };
    },
    mutationFn: async () => {
      const { error } = await peachAPI.private.user.redeemNoPeachFees();
      if (error) {
        throw new Error(error.error);
      }
    },
    onSuccess: () => {
      setPopup(
        <PopupComponent
          title={i18n("settings.referrals.noPeachFees.popup.title")}
          content={i18n("settings.referrals.noPeachFees.popup.success")}
          actions={<ClosePopupAction style={tw`justify-center`} />}
        />,
      );
    },
    onError: (error, _variables, previousData) => {
      showErrorBanner(error.message);
      return queryClient.setQueryData(userKeys.self(), previousData);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.self() }),
  });
}
