import { View } from "react-native";
import { EscrowButton } from "../../components/EscrowButton";
import { Icon } from "../../components/Icon";
import {
  ConfirmSlider,
  UnlockedSlider,
} from "../../components/inputs/confirmSlider/ConfirmSlider";
import { PeachText } from "../../components/text/PeachText";
import { Timer } from "../../components/text/Timer";
import { useFundingStatus } from "../../hooks/query/useFundingStatus";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import tw from "../../styles/tailwind";
import { getOfferIdFromContract } from "../../utils/contract/getOfferIdFromContract";
import { getRequiredAction } from "../../utils/contract/getRequiredAction";
import { getSellOfferIdFromContract } from "../../utils/contract/getSellOfferIdFromContract";
import { isPaymentTooLate } from "../../utils/contract/status/isPaymentTooLate";
import i18n from "../../utils/i18n";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { peachWallet } from "../../utils/wallet/setWallet";
import { FundFromPeachWalletButton } from "../fundEscrow/FundFromPeachWalletButton";
import {
  ChatButton,
  NewOfferButton,
  PayoutPendingButton,
  ProvideEmailButton,
} from "./ContractButtons";
import {
  CancelTradeSlider,
  ExtendFundingTimerSlider,
  ExtendPaymentTimerSlider,
  PaymentMadeSlider,
  PaymentReceivedSlider,
  RefundEscrowSlider,
  ReleaseEscrowSlider,
  RepublishOfferSlider,
  ResolveCancelRequestSliders,
} from "./ContractSliders";
import { useContractContext } from "./context";

export const ContractActions = () => {
  const { contract, view } = useContractContext();
  const sellOfferId = getSellOfferIdFromContract(contract);
  const { fundingStatus, isLoading } = useFundingStatus(sellOfferId);

  const showFundFromPeachWallet =
    view === "seller" &&
    contract.tradeStatus === "fundEscrow" &&
    !!peachWallet?.balance &&
    peachWallet.balance > contract.amount &&
    !isLoading;

  return (
    <View style={tw`items-center justify-end w-full gap-3`}>
      <ContractButtons />

      {showFundFromPeachWallet && contract.escrow && fundingStatus && (
        <FundFromPeachWalletButton
          amount={contract.amount}
          offerId={sellOfferId}
          address={contract.escrow}
          addresses={[contract.escrow]}
          fundingStatus={fundingStatus}
        />
      )}
      <View style={tw`flex-row items-center justify-center gap-6`}>
        <EscrowButton {...contract} style={tw`flex-1`} />
        <ChatButton />
      </View>

      <ContractStatusInfo />

      {view === "buyer" ? <BuyerSliders /> : <SellerSliders />}
    </View>
  );
};

const TWELVEHOURSINMS = 43200000;
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

    if (requiredAction === "sendPayment" && !isCashTrade(paymentMethod)) {
      const paymentExpectedBy =
        contract.paymentExpectedBy?.getTime() ??
        contract.creationDate.getTime() + TWELVEHOURSINMS;
      if (Date.now() <= paymentExpectedBy || view === "buyer") {
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
  const showPayoutPendingButton =
    view === "buyer" && batchInfo?.completed === false && !releaseTxId;
  return (
    <>
      {showPayoutPendingButton && <PayoutPendingButton />}
      {!!isEmailRequired && <ProvideEmailButton />}
      {!!offer && isSellOffer(offer) && offer?.newOfferId && <NewOfferButton />}
    </>
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
  if (tradeStatus === "fundingExpired") {
    return (
      <>
        <CancelTradeSlider isBuyer />
        <ExtendFundingTimerSlider />
      </>
    );
  }
  return <></>;
}

function SellerSliders() {
  const { contract } = useContractContext();
  const { tradeStatus, disputeWinner, paymentMade, paymentExpectedBy } =
    contract;
  if (tradeStatus === "releaseEscrow" && !!disputeWinner) {
    return <ReleaseEscrowSlider />;
  }

  const requiredAction = getRequiredAction(contract);
  if (
    isPaymentTooLate({ paymentMade, paymentExpectedBy }) &&
    tradeStatus === "paymentTooLate"
  ) {
    return (
      <>
        <CancelTradeSlider />
        <ExtendPaymentTimerSlider />
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
