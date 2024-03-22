import { SwapStatus } from "boltz-swap-web-context/src/boltz-api/types";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Icon } from "../../../../components/Icon";
import { Loading } from "../../../../components/animation/Loading";
import { BTCAmount } from "../../../../components/bitcoin/BTCAmount";
import { BitcoinAddress } from "../../../../components/bitcoin/BitcoinAddress";
import { NewBubble } from "../../../../components/bubble/Bubble";
import { LightningInvoiceInput } from "../../../../components/inputs/LightningInvoiceInput";
import { ConfirmSlider } from "../../../../components/inputs/confirmSlider/ConfirmSlider";
import { useClosePopup } from "../../../../components/popup/GlobalPopup";
import { PopupAction } from "../../../../components/popup/PopupAction";
import { PopupComponent } from "../../../../components/popup/PopupComponent";
import { ParsedPeachText } from "../../../../components/text/ParsedPeachText";
import { PeachText } from "../../../../components/text/PeachText";
import { CopyAble } from "../../../../components/ui/CopyAble";
import { CENT } from "../../../../constants";
import { exportFile } from "../../../../hooks/exportFile";
import { useLiquidFeeRate } from "../../../../hooks/useLiquidFeeRate";
import { useValidatedState } from "../../../../hooks/useValidatedState";
import {
  STATUS_MAP,
  useBoltzSwapStore,
} from "../../../../store/useBoltzSwapStore";
import tw from "../../../../styles/tailwind";
import { SubmarineAPIResponse } from "../../../../utils/boltz/api/postSubmarineSwap";
import { useSwapStatus } from "../../../../utils/boltz/query/useSwapStatus";
import i18n from "../../../../utils/i18n";
import { round } from "../../../../utils/math/round";
import { thousands } from "../../../../utils/string/thousands";
import { openURL } from "../../../../utils/web/openURL";
import { useCreateInvoice } from "../../hooks/useCreateInvoice";
import { MSAT_PER_SAT } from "../../hooks/useLightningWalletBalance";
import { getRefundSubmarineSwapData } from "../Swaps";
import { ClaimSubmarineSwap } from "./ClaimSubmarineSwap";
import { RefundSubmarineSwap } from "./RefundSubmarineSwap";
import { useSwapOut } from "./hooks/useSwapOut";

const CLOSE_POPUP_TIMEOUT = 5000;

type RefundSwapProps = {
  swapId: string;
  status?: SwapStatus;
};
const RefundSwap = ({ swapId, status }: RefundSwapProps) => {
  const swaps = useBoltzSwapStore((state) => state.swaps);
  const swap = swaps[swapId];
  const [refund, setRefund] = useState(false);
  const [refundError, setRefundError] = useState<string>();
  const startRefund = () => setRefund(true);
  const downloadRefundFile = () =>
    exportFile(JSON.stringify(swap), `swap-${swapId}.json`);

  if (refund) {
    const refundSubmarineSwapData = getRefundSubmarineSwapData({
      swap,
      status,
    });
    return (
      <View style={tw`gap-5`}>
        {!refundError ? (
          <>
            <PeachText style={tw`text-center text-primary-main h5`}>
              {i18n("wallet.swap.doNotCloseApp")}
            </PeachText>
            <Loading style={tw`self-center w-16 h-16`} />
            {!!refundSubmarineSwapData && (
              <RefundSubmarineSwap
                {...refundSubmarineSwapData}
                setRefundError={setRefundError}
              />
            )}
          </>
        ) : (
          <>
            <ParsedPeachText
              style={tw`text-center text-primary-main subtitle-2`}
              parse={[
                {
                  type: "url",
                  style: tw`underline`,
                  onPress: openURL,
                  renderText: (text: string) => `\n${text}`,
                },
              ]}
            >
              {i18n("wallet.swap.refund.failed") +
                i18n("wallet.swap.refund.contactCustomerSupport")}
            </ParsedPeachText>
            <View style={tw`flex-row justify-center`}>
              <NewBubble
                color="orange"
                onPress={downloadRefundFile}
                iconId="download"
              >
                {i18n("wallet.swap.refund.file")}
              </NewBubble>
            </View>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={tw`gap-5`}>
      <PeachText style={tw`text-center text-primary-main h5`}>
        {i18n("wallet.swap.refund")}
      </PeachText>
      <ConfirmSlider
        theme="info"
        label1={i18n("wallet.swap.confirm")}
        onConfirm={startRefund}
      />
    </View>
  );
};

type SwapHasFailedProps = {
  canSwapOut: boolean;
  swapOut: () => void;
};
const SwapHasFailed = ({ swapOut, canSwapOut }: SwapHasFailedProps) => (
  <View style={tw`gap-5`}>
    <PeachText style={tw`text-center text-primary-main h5`}>
      {i18n("wallet.swap.failed.tryAgain")}
    </PeachText>
    <ConfirmSlider
      theme="info"
      label1={i18n("wallet.swap.confirm")}
      onConfirm={swapOut}
      enabled={canSwapOut}
    />
  </View>
);

type SwapInProgressProps = {
  invoice: string;
  status?: SwapStatus;
  swapInfo?: SubmarineAPIResponse;
  keyPairWIF?: string;
};
const SwapInProgress = ({
  invoice,
  status,
  swapInfo,
  keyPairWIF,
}: SwapInProgressProps) => (
  <View style={tw`gap-5`}>
    <PeachText style={tw`text-center text-primary-main h5`}>
      {i18n("wallet.swap.doNotCloseApp")}
    </PeachText>
    <Loading style={tw`self-center w-16 h-16`} />
    {status?.status === "transaction.claim.pending" &&
      !!swapInfo &&
      !!keyPairWIF && (
        <ClaimSubmarineSwap {...{ invoice, swapInfo, keyPairWIF }} />
      )}
  </View>
);

const SwapSuccessful = () => (
  <View style={tw`gap-5`}>
    <PeachText style={tw`text-center text h5`}>
      {i18n("wallet.swap.success.text")}
    </PeachText>
    <Icon
      style={tw`self-center`}
      size={64}
      id="checkCircle"
      color={tw.color(`success-main`)}
    />
  </View>
);

type SetInvoicePopupContentProps = {
  status?: SwapStatus;
  invoice: string;
  setInvoice: (invoice: string) => void;
  invoiceErrors: string[];
  swapInfo?: SubmarineAPIResponse;
  amount: number;
  boltzFees: number;
  miningFees: number;
  canSwapOut: boolean;
  swapOut: () => void;
};
const SetInvoicePopupContent = ({
  status,
  invoice,
  setInvoice,
  invoiceErrors,
  swapInfo,
  amount,
  miningFees,
  boltzFees,
  canSwapOut,
  swapOut,
}: SetInvoicePopupContentProps) => {
  const feeRate = useLiquidFeeRate();
  const feePercentage = round((boltzFees / amount) * CENT, 2);
  if (status?.status === "transaction.claimed") return <SwapSuccessful />;
  if (status?.status === "transaction.refunded") return <SwapSuccessful />;

  if (status?.status === "invoice.set" && swapInfo?.address)
    return (
      <View style={tw`gap-4 items-center`}>
        <PeachText selectable>
          {i18n("wallet.swap.sendToAddress")} {swapInfo.expectedAmount}
          <CopyAble value={String(swapInfo.expectedAmount)} />
        </PeachText>
        <BitcoinAddress address={swapInfo.address} amount={amount} />
      </View>
    );

  return (
    <>
      <View style={tw`gap-3`}>
        <PeachText>{i18n("wallet.sendBitcoin.youreSending")}</PeachText>
        <BTCAmount chain="liquid" amount={amount} size="medium" />
        <PeachText>
          {i18n(
            "transaction.details.networkFee",
            thousands(miningFees),
            thousands(feeRate),
          )}
        </PeachText>
        <PeachText>
          {i18n("wallet.swap.swapFee", thousands(boltzFees))} ({feePercentage}%)
        </PeachText>
        <PeachText>
          {i18n("wallet.swap.total", thousands(boltzFees + miningFees))}
        </PeachText>
      </View>
      <LightningInvoiceInput
        onChangeText={setInvoice}
        value={invoice}
        errorMessage={invoiceErrors}
      />
      <ConfirmSlider
        theme="info"
        label1={i18n("wallet.swap.confirm")}
        onConfirm={swapOut}
        enabled={canSwapOut}
      />
    </>
  );
};

type SetInvoicePopupProps = {
  amount: number;
  miningFees: number;
  boltzFees: number;
};
export const SetInvoicePopup = ({
  amount,
  miningFees,
  boltzFees,
}: SetInvoicePopupProps) => {
  const closePopup = useClosePopup();
  const lightningInvoiceRules = useMemo(
    () => ({
      required: true,
      lightningInvoice: true,
      invoiceHasCorrectAmount: amount,
    }),
    [amount],
  );
  const [invoice, setInvoice, isInvoiceValid, invoiceErrors] =
    useValidatedState<string>("", lightningInvoiceRules);
  const { swapOut, postSwapInProgress, swapInfo, keyPairWIF, swapOutError } =
    useSwapOut({
      miningFees,
      invoice,
    });
  const localSwap = useBoltzSwapStore((state) =>
    swapInfo?.id ? state.swaps[swapInfo?.id] : undefined,
  );
  const { status } = useSwapStatus({ id: swapInfo?.id });
  const needsRefund = status?.status
    ? STATUS_MAP.SUBMARINE.ERROR.includes(status?.status)
    : false;
  const isCompleted = status?.status
    ? STATUS_MAP.SUBMARINE.COMPLETED.includes(status?.status)
    : false;
  const canSwapOut =
    !isInvoiceValid || status?.status !== "transaction.claimed";
  const {
    invoice: createdInvoice,
    createInvoice,
    isCreatingInvoice,
  } = useCreateInvoice({
    amountMsat: amount * MSAT_PER_SAT,
    description: "Boltz Swap out",
  });
  useEffect(() => {
    createInvoice();
  }, [createInvoice, setInvoice]);

  useEffect(() => {
    if (createdInvoice) setInvoice(createdInvoice);
  }, [createdInvoice, setInvoice]);

  if (status?.status === "transaction.claimed") {
    setTimeout(closePopup, CLOSE_POPUP_TIMEOUT);
  }

  return (
    <PopupComponent
      title={i18n(
        isCompleted
          ? "wallet.swap.success.title"
          : needsRefund || swapOutError
            ? "wallet.swap.failed"
            : "wallet.swap.toLightning",
      )}
      bgColor={tw`bg-info-background`}
      actionBgColor={tw`bg-info-light`}
      content={
        localSwap?.status?.status === "transaction.claimed" ? (
          <SwapSuccessful />
        ) : localSwap?.status?.status === "transaction.refunded" ? (
          <SwapSuccessful />
        ) : isCreatingInvoice ? (
          <Loading style={tw`self-center w-16 h-16`} />
        ) : needsRefund && swapInfo?.id ? (
          <RefundSwap {...{ swapId: swapInfo?.id, status }} />
        ) : swapOutError ? (
          <SwapHasFailed {...{ canSwapOut, swapOut }} />
        ) : postSwapInProgress ? (
          <SwapInProgress {...{ invoice, status, swapInfo, keyPairWIF }} />
        ) : (
          <SetInvoicePopupContent
            {...{
              status,
              invoice,
              setInvoice,
              invoiceErrors,
              swapInfo,
              amount,
              miningFees,
              boltzFees,
              keyPairWIF,
              canSwapOut,
              swapOut,
            }}
          />
        )
      }
      actions={
        <PopupAction
          style={tw`justify-center`}
          label={i18n("close")}
          iconId="xSquare"
          onPress={closePopup}
        />
      }
    />
  );
};
