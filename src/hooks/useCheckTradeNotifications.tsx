import NotificationBadge from "@msml/react-native-notification-badge";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { ContractSummary } from "../../peach-api/src/@types/contract";
import { OfferSummary } from "../../peach-api/src/@types/offer";
import { useTradeSummaryStore } from "../store/tradeSummaryStore";
import { info } from "../utils/log/info";
import { isIOS } from "../utils/system/isIOS";
import { useNotificationStore } from "../views/home/notificationsStore";

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
export const statusWithRequiredActionForBuyer: TradeStatus[] = [
  "paymentRequired",
];
export const statusWithRequiredActionForSeller: TradeStatus[] = [
  "confirmPaymentRequired",
];

const hasRequiredAction = (offer: OfferSummary | ContractSummary) =>
  statusWithRequiredAction.includes(offer.tradeStatus) ||
  (offer.type === "bid" &&
    statusWithRequiredActionForBuyer.includes(offer.tradeStatus)) ||
  (offer.type === "ask" &&
    statusWithRequiredActionForSeller.includes(offer.tradeStatus));

export const useCheckTradeNotifications = () => {
  const [offers, contracts] = useTradeSummaryStore(
    (state) => [state.offers, state.contracts],
    shallow,
  );
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  useEffect(() => {
    const offersWithAction = offers
      .filter(({ contractId }) => !contractId)
      .filter((offer) => hasRequiredAction(offer)).length;
    const contractsWithAction = contracts.filter(
      (contract) => hasRequiredAction(contract) || contract.unreadMessages > 0,
    ).length;
    const notifications = offersWithAction + contractsWithAction;

    info("checkTradeNotifications", notifications);

    if (isIOS()) NotificationBadge.setNumber(notifications);

    setNotifications(notifications);
  }, [setNotifications, offers, contracts]);
};
