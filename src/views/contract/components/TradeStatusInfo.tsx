import { View } from "react-native";
import { useWalletLabel } from "../../../components/offer/useWalletLabel";
import { PeachText } from "../../../components/text/PeachText";
import { HorizontalLine } from "../../../components/ui/HorizontalLine";
import { useOfferDetail } from "../../../hooks/query/useOfferDetail";
import tw from "../../../styles/tailwind";
import { contractIdToHex } from "../../../utils/contract/contractIdToHex";
import { getSellOfferIdFromContract } from "../../../utils/contract/getSellOfferIdFromContract";
import { isPaymentTooLate } from "../../../utils/contract/status/isPaymentTooLate";
import { isSellOffer } from "../../../utils/offer/isSellOffer";
import { isCashTrade } from "../../../utils/paymentMethod/isCashTrade";
import { useContractContext } from "../context";
import { getSellerDisputeStatusText } from "../helpers/getSellerDisputeStatusText";
import { tradeInformationGetters } from "../helpers/tradeInformationGetters";
import { SummaryItem } from "./SummaryItem";
import { useTranslate } from "@tolgee/react";
import { tolgee } from "../../../tolgee";

export const TradeStatusInfo = () => {
  const { contract, view } = useContractContext();
  const { t } = useTranslate("contract");
  return (
    <View style={tw`justify-center gap-5 grow`}>
      <SummaryItem
        label={t(`contract.summary.${view === "buyer" ? "seller" : "buyer"}`)}
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
  const buyerCanceledTrade =
    !contract.cancelationRequested && contract.canceledBy === "buyer";
  const collaborativeTradeCancel = contract.cancelationRequested;
  const isCash = isCashTrade(contract.paymentMethod);
  if (isCash && contract.canceled) {
    return tolgee.t(
      contract.canceledBy === "buyer"
        ? "contract.buyer.buyerCanceledCashTrade"
        : "contract.buyer.sellerCanceledCashTrade",
      { ns: "contract" },
    );
  }

  const paymentWasTooLate = isPaymentTooLate(contract);
  if (buyerCanceledTrade) {
    return tolgee.t("contract.buyer.buyerCanceledTrade", { ns: "contract" });
  } else if (collaborativeTradeCancel) {
    const isResolved = contract.canceled;
    return tolgee.t(
      isResolved
        ? "contract.buyer.collaborativeCancel.resolved"
        : "contract.buyer.collaborativeCancel.notResolved",
      { ns: "contract" },
    );
  } else if (paymentWasTooLate) {
    return tolgee.t(
      contract.canceled
        ? "contract.buyer.paymentWasTooLate"
        : "contract.buyer.paymentWasTooLate.waitingForSeller",
      { ns: "contract" },
    );
  }
  if (contract.disputeWinner === "seller") {
    return tolgee.t("contract.buyer.disputeLost", { ns: "contract" });
  }
  const isResolved = !!contract.releaseTxId;
  return tolgee.t(
    isResolved
      ? "contract.buyer.disputeWon.paidOut"
      : "contract.buyer.disputeWon.awaitingPayout",
    { ns: "contract" },
  );
}

function SellerStatusText({ contract }: { contract: Contract }) {
  const { offer } = useOfferDetail(getSellOfferIdFromContract(contract));
  const sellOffer = offer && isSellOffer(offer) ? offer : null;
  const walletLabel = useWalletLabel({ address: sellOffer?.returnAddress });
  const text = !sellOffer
    ? tolgee.t("loading")
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
  const [hasDisputeWinner, paymentWasTooLate] = [
    !!contract.disputeWinner,
    isPaymentTooLate(contract),
  ];

  if (paymentWasTooLate) {
    if (!contract.canceled) {
      return tolgee.t("contract.seller.paymentTimerHasRunOut.text", {
        ns: "contract",
        tradeId: contractIdToHex(contract.id),
      });
    }
    tolgee.t("contract.seller.refundOrRepublish.offer", {
      ns: "contract",
      wallet: walletLabel,
    });
  }

  const isResolved = sellOffer?.refunded || sellOffer?.newOfferId;
  if (isResolved) {
    if (sellOffer.newOfferId) {
      return tolgee.t("contract.seller.republished", {
        ns: "contract",
      });
    }
    return tolgee.t("contract.seller.refunded", {
      ns: "contract",
      wallet: walletLabel,
    });
  }
  if (hasDisputeWinner) {
    return getSellerDisputeStatusText(contract);
  }

  const isRepublishAvailable =
    contract.tradeStatus === "refundOrReviveRequired";
  if (isRepublishAvailable) {
    if (contract.canceledBy === "buyer") {
      if (!contract.cancelationRequested) {
        return tolgee.t("contract.seller.buyerCanceledWithoutRequest", {
          ns: "contract",
          wallet: walletLabel,
        });
      }
      return tolgee.t("contract.seller.buyerAgreedToCancel");
    }
    return tolgee.t("contract.seller.refundOrRepublish.trade", {
      ns: "contract",
      wallet: walletLabel,
    });
  }
  return tolgee.t(
    contract.canceledBy === "buyer" && !contract.cancelationRequested
      ? "contract.seller.refund.buyerCanceled"
      : "contract.seller.refund",
    {
      ns: "contract",
    },
  );
}
