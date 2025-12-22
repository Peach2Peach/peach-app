import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { MSINANHOUR } from "../../constants";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useRoute } from "../../hooks/useRoute";
import { ErrorPopup } from "../../popups/ErrorPopup";
import { patchSellOfferWithRefundTx } from "../../popups/tradeCancelation/patchSellOfferWithRefundTx";
import { useCancelContract } from "../../popups/tradeCancelation/useCancelContract";
import { useStartRefundPopup } from "../../popups/useStartRefundPopup";
import { getSellOfferIdFromContract } from "../../utils/contract/getSellOfferIdFromContract";
import { isPaymentTooLate } from "../../utils/contract/status/isPaymentTooLate";
import i18n from "../../utils/i18n";
import { isSellOffer } from "../../utils/offer/isSellOffer";
import { peachAPI } from "../../utils/peachAPI";
import { useContractContext } from "./context";
import { useConfirmPaymentSeller } from "./hooks/useConfirmPaymentSeller";
import { useContractMutation } from "./hooks/useContractMutation";
import { useRepublishOffer } from "./hooks/useRepublishOffer";

export function RepublishOfferSlider() {
  const { contract } = useContractContext();
  const { mutate: republishOffer } = useRepublishOffer();
  return (
    <ConfirmSlider
      onConfirm={() => republishOffer(contract)}
      label1={i18n("republishOffer")}
      iconId="refreshCw"
    />
  );
}
export function RefundEscrowSlider() {
  const { contract } = useContractContext();
  const startRefund = useStartRefundPopup();
  const { offer } = useOfferDetail(getSellOfferIdFromContract(contract));
  const onConfirm = () => {
    if (!offer || !isSellOffer(offer)) return;
    startRefund(offer);
  };
  return (
    <ConfirmSlider
      onConfirm={onConfirm}
      enabled={!!offer}
      label1={i18n("refundEscrow")}
      iconId="rotateCounterClockwise"
    />
  );
}

export function PaymentMadeSlider() {
  const { contractId } = useRoute<"contract">().params;
  const { contract } = useContractContext();

  const { isPending, mutate } = useContractMutation(
    {
      id: contract.id,
      paymentMade: new Date(),
      tradeStatus: "confirmPaymentRequired",
    },
    {
      mutationFn: async () => {
        const { error: err } =
          await peachAPI.private.contract.confirmPaymentBuyer({ contractId });
        if (err) throw new Error(err.error);
      },
    },
  );

  return (
    <ConfirmSlider
      enabled={!isPending && !isPaymentTooLate(contract)}
      onConfirm={() => mutate()}
      label1={i18n("contract.payment.buyer.confirm")}
      label2={i18n("contract.payment.made")}
    />
  );
}

export function PaymentReceivedSlider() {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const { contract } = useContractContext();
  const { isPending, mutate } = useConfirmPaymentSeller({
    contract,
    optimisticContract: {
      paymentConfirmed: new Date(),
      tradeStatus: "rateUser",
    },
  });

  const showLastConfirmationPopup = () => {
    setPopup(
      <ErrorPopup
        title={i18n(`contract.seller.confirmPaymentReceivedLastChance.title`)}
        content={i18n(`contract.seller.confirmPaymentReceivedLastChance.text`)}
        actions={
          <>
            <PopupAction
              label={i18n("Yes, proceed")}
              iconId="thumbsUp"
              onPress={() => {
                closePopup();
                mutate();
              }}
            />

            <ClosePopupAction reverseOrder />
          </>
        }
      />,
    );
  };

  const label1 = contract.disputeActive
    ? "contract.payment.disputeIsActive"
    : "contract.payment.confirm";

  return (
    <ConfirmSlider
      enabled={!isPending && !contract.disputeActive}
      onConfirm={showLastConfirmationPopup}
      label1={i18n(label1)}
      label2={i18n("contract.payment.received")}
    />
  );
}
export function CancelTradeSlider() {
  const { contract } = useContractContext();
  const { mutate } = useCancelContract({
    contractId: contract.id,
    optimisticContract: {
      canceled: true,
      tradeStatus: "refundOrReviveRequired",
    },
  });

  const cancelContract = () => {
    mutate(undefined, {
      onSuccess: async ({ psbt }) => {
        if (psbt) await patchSellOfferWithRefundTx(contract, psbt);
      },
    });
  };

  return (
    <ConfirmSlider
      iconId="xCircle"
      onConfirm={cancelContract}
      label1={i18n("contract.seller.paymentTimerHasRunOut.cancelTrade")}
    />
  );
}
const MAX_HOURS_FOR_PAYMENT = 12;
export function ExtendTimerSlider() {
  const { contractId } = useRoute<"contract">().params;
  const { mutate } = useContractMutation(
    {
      id: contractId,
      paymentExpectedBy: new Date(
        Date.now() + MSINANHOUR * MAX_HOURS_FOR_PAYMENT,
      ),
    },
    {
      mutationFn: async () => {
        const { result, error: err } =
          await peachAPI.private.contract.extendPaymentTimer({ contractId });
        if (!result || err)
          throw new Error(err?.error || "Error extending payment timer");
      },
    },
  );

  return (
    <ConfirmSlider
      iconId="arrowRightCircle"
      onConfirm={() => mutate()}
      label1={i18n("contract.seller.giveMoreTime")}
    />
  );
}
export function ResolveCancelRequestSliders() {
  const { contractId } = useRoute<"contract">().params;

  const { mutate: continueTrade } = useContractMutation(
    { id: contractId, cancelationRequested: false },
    {
      mutationFn: async () => {
        const { error: err } =
          await peachAPI.private.contract.rejectContractCancelation({
            contractId,
          });
        if (err) throw new Error(err.error);
      },
    },
  );

  const { mutate: cancelTrade } = useContractMutation(
    { id: contractId, canceled: true, cancelationRequested: false },
    {
      mutationFn: async () => {
        const { error: err } =
          await peachAPI.private.contract.confirmContractCancelation({
            contractId,
          });
        if (err) throw new Error(err.error);
      },
    },
  );

  return (
    <>
      <ConfirmSlider
        onConfirm={() => cancelTrade()}
        label1={i18n("contract.cancelationRequested.agree")}
        iconId="xCircle"
      />
      <ConfirmSlider
        onConfirm={() => continueTrade()}
        label1={i18n("contract.cancelationRequested.continueTrade")}
        iconId="arrowRightCircle"
      />
    </>
  );
}
export function ReleaseEscrowSlider() {
  const { contract } = useContractContext();
  const { mutate } = useConfirmPaymentSeller({
    contract,
    optimisticContract: {
      paymentConfirmed: new Date(),
      releaseTxId: "",
      disputeResolvedDate: new Date(),
    },
  });

  return (
    <ConfirmSlider label1={i18n("releaseEscrow")} onConfirm={() => mutate()} />
  );
}
