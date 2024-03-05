import NotificationBadge from "@msml/react-native-notification-badge";
import { useEffect, useMemo } from "react";
import { ContractSummary } from "../../peach-api/src/@types/contract";
import { OfferSummary } from "../../peach-api/src/@types/offer";
import { info } from "../utils/log/info";
import { isIOS } from "../utils/system/isIOS";
import { useNotificationStore } from "../views/home/notificationsStore";
import { useContractSummaries } from "./query/useContractSummaries";
import { useOfferSummaries } from "./query/useOfferSummaries";

export const statusWithRequiredAction: TradeStatus[] = [
  "fundEscrow",
  "fundingAmountDifferent",
  "hasMatchesAvailable",
  "refundAddressRequired",
  "refundTxSignatureRequired",
  "dispute",
  "rateUser",
  "confirmCancelation",
  "refundOrReviveRequired",
];

const hasRequiredAction = ({
  type,
  tradeStatus,
}: OfferSummary | ContractSummary) =>
  statusWithRequiredAction.includes(tradeStatus) ||
  (type === "bid" && tradeStatus === "paymentRequired") ||
  (type === "ask" && tradeStatus === "confirmPaymentRequired");

export const useCheckTradeNotifications = () => {
  const { offers } = useOfferSummaries();
  const { contracts } = useContractSummaries();
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );
  const notifications = useMemo(() => {
    const offersWithAction = offers
      .filter(({ contractId }) => !contractId)
      .filter((offer) => hasRequiredAction(offer)).length;
    const contractsWithAction = contracts.filter(
      (contract) => hasRequiredAction(contract) || contract.unreadMessages > 0,
    ).length;
    return offersWithAction + contractsWithAction;
  }, [offers, contracts]);
  useEffect(() => {
    info("checkTradeNotifications", notifications);

    if (isIOS()) NotificationBadge.setNumber(notifications);

    setNotifications(notifications);
  }, [setNotifications, notifications]);
};
