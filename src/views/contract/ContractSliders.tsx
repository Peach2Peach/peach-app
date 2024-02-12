import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { MSINANHOUR } from "../../constants";
import { useRoute } from "../../hooks/useRoute";
import { cancelContractAsSeller } from "../../popups/tradeCancelation/cancelContractAsSeller";
import { useStartRefundPopup } from "../../popups/useStartRefundPopup";
import { getSellOfferFromContract } from "../../utils/contract/getSellOfferFromContract";
import { isPaymentTooLate } from "../../utils/contract/status/isPaymentTooLate";
import { verifyAndSignReleaseTx } from "../../utils/contract/verifyAndSignReleaseTx";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { getEscrowWalletForOffer } from "../../utils/wallet/getEscrowWalletForOffer";
import { useContractContext } from "./context";
import { useContractMutation } from "./hooks/useContractMutation";
import { useReleaseEscrow } from "./hooks/useReleaseEscrow";
import { useRepublishOffer } from "./hooks/useRepublishOffer";

export function RepublishOfferSlider() {
  const { contract } = useContractContext();
  const republishOffer = useRepublishOffer();
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
  return (
    <ConfirmSlider
      onConfirm={() => startRefund(getSellOfferFromContract(contract))}
      label1={i18n("refundEscrow")}
      iconId="rotateCounterClockwise"
    />
  );
}

export function PaymentMadeSlider() {
  const { contractId } = useRoute<"contract">().params;
  const { contract } = useContractContext();

  const mutation = useContractMutation(
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
      enabled={!mutation.isPending && !isPaymentTooLate(contract)}
      onConfirm={() => mutation.mutate()}
      label1={i18n("contract.payment.buyer.confirm")}
      label2={i18n("contract.payment.made")}
    />
  );
}

export function PaymentReceivedSlider() {
  const { contract } = useContractContext();
  const mutation = useContractMutation(
    { id: contract.id, paymentConfirmed: new Date(), tradeStatus: "rateUser" },
    {
      mutationFn: async () => {
        const sellOffer = getSellOfferFromContract(contract);

        const { result, error } =
          verifyAndSignReleaseTx(
            contract,
            sellOffer,
            getEscrowWalletForOffer(sellOffer),
          );

        if (!result?.releaseTransaction) {
          throw new Error(error);
        }

        const { error: err } =
          await peachAPI.private.contract.confirmPaymentSeller({
            contractId: contract.id,
            releaseTransaction: result.releaseTransaction,
            batchReleasePsbt: result.batchReleasePsbt,
          });
        if (err) throw new Error(err.error);
      },
    },
  );

  return (
    <ConfirmSlider
      enabled={!mutation.isPending}
      onConfirm={() => mutation.mutate()}
      label1={i18n("contract.payment.confirm")}
      label2={i18n("contract.payment.received")}
    />
  );
}
export function CancelTradeSlider() {
  const { contract } = useContractContext();
  const { mutate } = useContractMutation(
    { id: contract.id, canceled: true, tradeStatus: "refundOrReviveRequired" },
    {
      mutationFn: async () => {
        const { result, error } = await cancelContractAsSeller(contract);
        if (!result || error) throw new Error(error);
      },
    },
  );

  return (
    <ConfirmSlider
      iconId="xCircle"
      onConfirm={() => mutate()}
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
  const { mutate } = useReleaseEscrow(contract);

  return (
    <ConfirmSlider label1={i18n("releaseEscrow")} onConfirm={() => mutate()} />
  );
}
