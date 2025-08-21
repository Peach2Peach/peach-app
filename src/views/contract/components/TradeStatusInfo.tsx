import { View } from "react-native";
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
  const text = getBuyerStatusText(contract);
  return <PeachText style={tw`md:body-l`}>{text}</PeachText>;
}

function getBuyerStatusText(contract: Contract) {
  if (contract.escrowFundingTimeLimitExpired) {
    return i18n("contract.buyer.sellerDidntFundEscrowInTime");
  }

  const buyerCanceledTrade =
    !contract.cancelationRequested && contract.canceledBy === "buyer";
  const collaborativeTradeCancel = contract.cancelationRequested;
  const isCash = isCashTrade(contract.paymentMethod);
  if (isCash && contract.canceled) {
    return i18n(
      contract.canceledBy === "buyer"
        ? "contract.buyer.buyerCanceledCashTrade"
        : "contract.buyer.sellerCanceledCashTrade",
    );
  }

  const paymentWasTooLate = isPaymentTooLate(contract);
  if (buyerCanceledTrade) {
    return i18n("contract.buyer.buyerCanceledTrade");
  } else if (collaborativeTradeCancel) {
    const isResolved = contract.canceled;
    return i18n(
      isResolved
        ? "contract.buyer.collaborativeCancel.resolved"
        : "contract.buyer.collaborativeCancel.notResolved",
    );
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
  return i18n(
    isResolved
      ? "contract.buyer.disputeWon.paidOut"
      : "contract.buyer.disputeWon.awaitingPayout",
  );
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
  if (contract.escrowFundingTimeLimitExpired) {
    return i18n("contract.seller.sellerDidntFundEscrowInTime");
  }
  const [hasDisputeWinner, paymentWasTooLate] = [
    !!contract.disputeWinner,
    isPaymentTooLate(contract),
  ];

  if (paymentWasTooLate) {
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
  if (hasDisputeWinner) {
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
      ? "contract.seller.refund.buyerCanceled"
      : "contract.seller.refund",
  );
}
