import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { useSetOverlay } from "../../../Overlay";
import { FIFTEEN_SECONDS } from "../../../constants";
import { useHandleNotifications } from "../../../hooks/notifications/useHandleNotifications";
import { useContractDetail } from "../../../hooks/query/useContractDetail";
import { useRoute } from "../../../hooks/useRoute";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { useAccountStore } from "../../../utils/account/account";
import { logTradeCompleted } from "../../../utils/analytics/logTradeCompleted";
import { getContractViewer } from "../../../utils/contract/getContractViewer";
import { TradeComplete } from "../../tradeComplete/TradeComplete";
import { useShowHighFeeWarning } from "./useShowHighFeeWarning";
import { useShowLowFeeWarning } from "./useShowLowFeeWarning";

export const useContractSetup = () => {
  const { contractId } = useRoute<"contract">().params;
  const isFocused = useIsFocused();
  const { contract, isLoading, refetch } = useContractDetail(
    contractId,
    FIFTEEN_SECONDS,
  );
  const publicKey = useAccountStore((state) => state.account.publicKey);
  const view = contract
    ? getContractViewer(contract.seller.id, publicKey)
    : undefined;
  const navigation = useStackNavigation();
  const shouldShowFeeWarning =
    view === "buyer" && !!contract?.paymentMade && !contract?.paymentConfirmed;

  useHandleNotifications(
    useCallback(
      (message) => {
        if (message.data?.contractId === contractId) refetch();
      },
      [contractId, refetch],
    ),
  );

  useShowHighFeeWarning({
    enabled: shouldShowFeeWarning,
    amount: contract?.amount,
  });
  useShowLowFeeWarning({ enabled: shouldShowFeeWarning });

  const setOverlay = useSetOverlay();
  useEffect(() => {
    if (isFocused && contract?.tradeStatus === "rateUser") {
      logTradeCompleted(contract);
      setOverlay(<TradeComplete contractId={contractId} />);
    }
  }, [
    contract,
    contract?.tradeStatus,
    contractId,
    isFocused,
    navigation,
    setOverlay,
  ]);

  return {
    contract,
    isLoading,
    view,
  };
};
