import { View } from "react-native";
import { EscrowButton } from "../../components/EscrowButton";
import { Icon } from "../../components/Icon";
import {
  ConfirmSlider,
  UnlockedSlider,
} from "../../components/inputs/confirmSlider/ConfirmSlider";
import { PeachText } from "../../components/text/PeachText";
import { Timer } from "../../components/text/Timer";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import tw from "../../styles/tailwind";
import { getOfferIdFromContract } from "../../utils/contract/getOfferIdFromContract";
import { getPaymentExpectedBy } from "../../utils/contract/getPaymentExpectedBy";
import { getRequiredAction } from "../../utils/contract/getRequiredAction";
import { isPaymentTooLate } from "../../utils/contract/status/isPaymentTooLate";
import i18n from "../../utils/i18n";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import {
  ChatButton,
  NewOfferButton,
  PayoutPendingButton,
  ProvideEmailButton,
} from "./ContractButtons";
import {
  CancelTradeSlider,
  ExtendTimerSlider,
  PaymentMadeSlider,
  PaymentReceivedSlider,
  RefundEscrowSlider,
  ReleaseEscrowSlider,
  RepublishOfferSlider,
  ResolveCancelRequestSliders,
} from "./ContractSliders";
import { isFundingTradeStatus } from "./components/TradeInformation";
import { useContractContext } from "./context";

export const ContractActions = () => {
  const { contract, view } = useContractContext();
  return (
    <View style={tw`items-center justify-end w-full gap-3`}>
      <View style={tw`flex-row items-center justify-center gap-6`}>
        {contract.escrow && <EscrowButton {...contract} style={tw`flex-1`} />}
        <ChatButton />
      </View>

      <ContractStatusInfo />

      <ContractButtons />
      {!isFundingTradeStatus(contract.tradeStatus) &&
        (view === "buyer" ? <BuyerSliders /> : <SellerSliders />)}
    </View>
  );
};

function ContractStatusInfo() {
  const { contract, view } = useContractContext();
  const { disputeActive, disputeWinner, cancelationRequested, paymentMethod } =
    contract;

  const shouldShowInfo = !(
    disputeActive ||
    disputeWinner ||
    cancelationRequested
  );

  if (shouldShowInfo) {
    const requiredAction = getRequiredAction(contract);

    if (
      requiredAction === "sendPayment" &&
      contract.tradeStatus !== "paymentTooLate" &&
      contract.tradeStatus !== "waitingForFunding" &&
      contract.tradeStatus !== "escrowWaitingForConfirmation" &&
      !isCashTrade(paymentMethod)
    ) {
      const paymentExpectedBy = getPaymentExpectedBy(contract);
      if (
        (Date.now() <= paymentExpectedBy || view === "buyer") &&
        contract.tradeStatus !== "fundEscrow"
      ) {
        return (
          <Timer
            text={i18n(`contract.timer.${requiredAction}.${view}`)}
            end={paymentExpectedBy}
          />
        );
      }
      return <></>;
    }

    if (requiredAction === "confirmPayment") {
      return (
        <View style={tw`flex-row items-center justify-center`}>
          <PeachText style={tw`text-center button-medium`}>
            {i18n(`contract.timer.confirmPayment.${view}`)}
          </PeachText>
          {view === "seller" && (
            <Icon
              id="check"
              style={tw`w-5 h-5 ml-1 -mt-0.5`}
              color={tw.color("success-main")}
            />
          )}
        </View>
      );
    }
  }

  return <></>;
}

function ContractButtons() {
  const { contract, view } = useContractContext();
  const { isEmailRequired, batchInfo, releaseTxId } = contract;
  const { offer } = useOfferDetail(
    contract ? getOfferIdFromContract(contract) : "",
  );
  return (
    <>
      {shouldShowPayoutPending(view, batchInfo, releaseTxId) && (
        <PayoutPendingButton />
      )}
      {!!isEmailRequired && <ProvideEmailButton />}
      {!!offer && isSellOffer(offer) && offer?.newOfferId && <NewOfferButton />}
    </>
  );
}
function shouldShowPayoutPending(
  view: string,
  batchInfo: BatchInfo | undefined,
  releaseTxId: string | undefined,
) {
  return (
    view === "buyer" && !!batchInfo && !batchInfo.completed && !releaseTxId
  );
}

function BuyerSliders() {
  const { contract } = useContractContext();
  const { tradeStatus, disputeWinner } = contract;
  const requiredAction = getRequiredAction(contract);

  if (tradeStatus === "confirmCancelation") {
    return <ResolveCancelRequestSliders />;
  }
  if (requiredAction === "sendPayment") {
    return <PaymentMadeSlider />;
  }
  if (requiredAction === "confirmPayment" && !disputeWinner) {
    return <UnlockedSlider label={i18n("contract.payment.made")} />;
  }
  return <></>;
}

function SellerSliders() {
  const { contract } = useContractContext();
  const { tradeStatus, disputeWinner } = contract;
  if (tradeStatus === "releaseEscrow" && !!disputeWinner) {
    return <ReleaseEscrowSlider />;
  }

  const requiredAction = getRequiredAction(contract);
  if (isPaymentTooLate(contract) && tradeStatus === "paymentTooLate") {
    return (
      <>
        <CancelTradeSlider />
        <ExtendTimerSlider />
      </>
    );
  }
  if (requiredAction === "sendPayment") {
    return (
      <ConfirmSlider
        enabled={false}
        onConfirm={() => null}
        label1={i18n("offer.requiredAction.waiting", i18n("buyer"))}
      />
    );
  }
  if (requiredAction === "confirmPayment") return <PaymentReceivedSlider />;

  if (tradeStatus === "refundOrReviveRequired") {
    return (
      <>
        <RepublishOfferSlider />
        <RefundEscrowSlider />
      </>
    );
  }
  if (tradeStatus === "refundTxSignatureRequired") {
    return <RefundEscrowSlider />;
  }
  return <></>;
}
