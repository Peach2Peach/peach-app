import { View } from "react-native";
import { Contract } from "../../../../peach-api/src/@types/contract";
import { useWalletLabel } from "../../../components/offer/useWalletLabel";
import { PeachText } from "../../../components/text/PeachText";
import { HorizontalLine } from "../../../components/ui/HorizontalLine";
import { useOfferDetail } from "../../../hooks/query/useOfferDetail";
import tw from "../../../styles/tailwind";
import { contractIdToHex } from "../../../utils/contract/contractIdToHex";
import { getSellOfferIdFromContract } from "../../../utils/contract/getSellOfferIdFromContract";
import { isPaymentTooLate } from "../../../utils/contract/status/isPaymentTooLate";
import i18n from "../../../utils/i18n";
import { isSellOffer } from "../../../utils/offer/isSellOffer";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";
import { useContractContext } from "../context";
import { getSellerDisputeStatusText } from "../helpers/getSellerDisputeStatusText";
import { tradeInformationGetters } from "../helpers/tradeInformationGetters";
import { SummaryItem } from "./SummaryItem";

export const TradeStatusInfo = () => {
  const { contract, view } = useContractContext();
  return (
    <View style={tw`justify-center gap-5 grow`}>
      <SummaryItem
        label={i18n(
          `contract.summary.${view === "buyer" ? "seller" : "buyer"}`,
        )}
        value={tradeInformationGetters[view === "buyer" ? "seller" : "buyer"](
          contract,
        )}
      />
      <HorizontalLine />
      {view === "buyer" ? (
        <BuyerStatusText contract={contract} />
      ) : (
        <SellerStatusText contract={contract} />
      )}
    </View>
  );
};

function BuyerStatusText({ contract }: { contract: Contract }) {
  return (
    <PeachText style={tw`md:body-l`}>{getBuyerStatusText(contract)}</PeachText>
  );
}

function getBuyerStatusText(contract: Contract) {
  if (contract.tradeStatus === "fundingExpired") {
    if (contract.fundingStatus === "NULL") {
      return "The seller has not funded the escrow yet.\n\nYou can either cancel the trade without a reputation penalty, or give the seller more time.";
    }
    return "There is an unconfirmed transaction to the escrow. This means you will have to wait before you can make the payment.\n\nYou can either cancel the trade without a reputation penalty, or give the seller more time.";
  }
  const isCash = isCashTrade(contract.paymentMethod);
  if (isCash && contract.canceled) {
    return i18n(
      contract.canceledBy === "buyer"
        ? "contract.buyer.buyerCanceledCashTrade"
        : "contract.buyer.sellerCanceledCashTrade",
    );
  }

  const { paymentMade, paymentExpectedBy, cancelationRequested } = contract;
  const paymentWasTooLate = isPaymentTooLate({
    paymentMade,
    paymentExpectedBy,
  });
  if (cancelationRequested) {
    const isResolved = contract.canceled;
    return i18n(
      isResolved
        ? "contract.buyer.collaborativeCancel.resolved"
        : "contract.buyer.collaborativeCancel.notResolved",
    );
  } else if (contract.canceledBy === "buyer") {
    return "You have successfully canceled this trade.";
  } else if (
    contract.canceledBy === "mediator" &&
    !contract.paymentMade &&
    !contract.disputeWinner
  ) {
    return "The seller has not funded the escrow correctly and this trade has been canceled.";
  } else if (paymentWasTooLate) {
    return i18n(
      contract.canceled
        ? "contract.buyer.paymentWasTooLate"
        : "contract.buyer.paymentWasTooLate.waitingForSeller",
    );
  }
  if (contract.disputeWinner === "seller") {
    return i18n("contract.buyer.disputeLost");
  }
  const isResolved = !!contract.releaseTxId;
  if (contract.disputeWinner === "buyer") {
    return i18n(
      isResolved
        ? "contract.buyer.disputeWon.paidOut"
        : "contract.buyer.disputeWon.awaitingPayout",
    );
  }
  return null;
}

function SellerStatusText({ contract }: { contract: Contract }) {
  const { offer } = useOfferDetail(getSellOfferIdFromContract(contract));
  const sellOffer = offer && isSellOffer(offer) ? offer : null;
  const walletLabel = useWalletLabel({ address: sellOffer?.returnAddress });
  const text = !sellOffer
    ? i18n("loading")
    : getSellerStatusText({ contract, sellOffer, walletLabel });

  return <PeachText style={tw`md:body-l`}>{text}</PeachText>;
}

function getSellerStatusText({
  contract,
  sellOffer,
  walletLabel,
}: {
  contract: Contract;
  sellOffer: SellOffer;
  walletLabel: string;
}) {
  if (contract.tradeStatus === "fundingExpired") {
    if (!contract.canceled) {
      return "Your funding transaction has not been confirmed yet. The buyer can decide to give you more time or to cancel the trade.\n\nIn either case, your reputation has been impacted.";
    }
    // if not funded:
    return "You didn't fund the escrow on time and the trade has been canceled.";
    // if funded:
    return "The buyer canceled and this offer has been republished. You can find the new offer below.";
  }
  const { paymentMade, paymentExpectedBy } = contract;

  if (isPaymentTooLate({ paymentMade, paymentExpectedBy })) {
    if (!contract.canceled) {
      return i18n(
        "contract.seller.paymentTimerHasRunOut.text",
        contractIdToHex(contract.id),
      );
    }
    i18n("contract.seller.refundOrRepublish.offer", walletLabel);
  }

  const isResolved = sellOffer?.refunded || sellOffer?.newOfferId;
  if (isResolved) {
    if (sellOffer.newOfferId) {
      return i18n("contract.seller.republished");
    }
    return i18n("contract.seller.refunded", walletLabel);
  }
  if (contract.disputeWinner) {
    return getSellerDisputeStatusText(contract);
  }

  const isRepublishAvailable =
    contract.tradeStatus === "refundOrReviveRequired";
  if (isRepublishAvailable) {
    if (contract.canceledBy === "buyer") {
      if (!contract.cancelationRequested) {
        return i18n("contract.seller.buyerCanceledWithoutRequest", walletLabel);
      }
      return i18n("contract.seller.buyerAgreedToCancel");
    }
    return i18n("contract.seller.refundOrRepublish.trade", walletLabel);
  }
  return i18n(
    contract.canceledBy === "buyer" && !contract.cancelationRequested
      ? contract.fundingStatus !== "NULL"
        ? "contract.seller.refund.buyerCanceled"
        : "contract.seller.refund.buyerCanceledNoRefund"
      : contract.fundingStatus === "NULL"
        ? "contract.seller.refundNotNeededAndReputationImpacted"
        : "contract.seller.refund",
  );
}
