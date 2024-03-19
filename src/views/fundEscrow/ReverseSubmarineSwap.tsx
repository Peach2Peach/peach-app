import { PaymentStatus } from "@breeztech/react-native-breez-sdk";
import bolt11 from "bolt11";
import { useEffect, useMemo } from "react";
import { shallow } from "zustand/shallow";
import { Icon } from "../../components/Icon";
import { Loading } from "../../components/animation/Loading";
import { LightningInvoice } from "../../components/bitcoin/LightningInvoice";
import { Button } from "../../components/buttons/Button";
import { TradeInfo } from "../../components/offer/TradeInfo";
import { ErrorBox } from "../../components/ui/ErrorBox";
import { SATSINBTC } from "../../constants";
import { useLiquidFeeRate } from "../../hooks/useLiquidFeeRate";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import tw from "../../styles/tailwind";
import { usePostReverseSubmarineSwap } from "../../utils/boltz/query/usePostReverseSubmarineSwap";
import { useSwapStatus } from "../../utils/boltz/query/useSwapStatus";
import i18n from "../../utils/i18n";
import { error } from "../../utils/log/error";
import { parseError } from "../../utils/parseError";
import { useWalletState } from "../../utils/wallet/walletStore";
import {
  MSAT_PER_SAT,
  useLightningWalletBalance,
} from "../wallet/hooks/useLightningWalletBalance";
import { usePayInvoice } from "../wallet/hooks/usePayInvoice";
import { ClaimReverseSubmarineSwap } from "./components/ClaimReverseSubmarineSwap";

export type Props = {
  offerId: string;
  address: string;
  amount: number;
};

const CLAIM_TX_SIZE_VB = 1380;

export const ReverseSubmarineSwap = ({ offerId, address, amount }: Props) => {
  const feeRate = useLiquidFeeRate();
  const minerFees = CLAIM_TX_SIZE_VB * feeRate;
  const amountWithTxFees = minerFees
    ? minerFees / SATSINBTC + amount
    : undefined;
  const { data, error: postReverseSubmarineError } =
    usePostReverseSubmarineSwap({
      address,
      amount: amountWithTxFees,
    });
  const swapInfo = data?.swapInfo;
  const { status } = useSwapStatus({ id: swapInfo?.id });
  const [saveSwap, mapSwap] = useBoltzSwapStore(
    (state) => [state.saveSwap, state.mapSwap],
    shallow,
  );

  useEffect(() => {
    if (data?.swapInfo) {
      saveSwap({
        ...data.swapInfo,
        keyPairIndex: data.keyPairIndex,
        preimage: data.preimage,
      });
      mapSwap(offerId, data?.swapInfo.id);
    }
  }, [
    data?.keyPairIndex,
    data?.preimage,
    data?.swapInfo,
    mapSwap,
    offerId,
    saveSwap,
  ]);

  if (postReverseSubmarineError?.message)
    return <ErrorBox>{postReverseSubmarineError.message}</ErrorBox>;
  if (!swapInfo?.invoice) return <Loading />;

  if (!!data && status?.status === "transaction.mempool")
    return (
      <ClaimReverseSubmarineSwap
        offerId={offerId}
        address={address}
        swapInfo={swapInfo}
        swapStatus={status}
        keyPairWIF={data.keyPairWIF}
        preimage={data.preimage}
      />
    );

  return (
    <>
      <LightningInvoice invoice={swapInfo.invoice} />
      <FundFromPeachLightningWalletButton
        invoice={swapInfo.invoice}
        address={address}
        onchainAmount={amount}
      />
    </>
  );
};

type FundFromPeachLightningWalletButtonProps = {
  invoice: string;
  address: string;
  onchainAmount: number;
};
function FundFromPeachLightningWalletButton({
  invoice,
  address,
  onchainAmount,
}: FundFromPeachLightningWalletButtonProps) {
  const showErrorBanner = useShowErrorBanner();
  const [fundedFromPeachWallet, setFundedFromPeachWallet] = useWalletState(
    (state) => [
      state.isFundedFromPeachWallet(address),
      state.setFundedFromPeachWallet,
    ],
    shallow,
  );
  const paymentRequest = useMemo(() => bolt11.decode(invoice), [invoice]);
  const amount = useMemo(() => {
    if (!paymentRequest.millisatoshis) return onchainAmount * SATSINBTC;
    return Number(paymentRequest.millisatoshis) / MSAT_PER_SAT;
  }, [onchainAmount, paymentRequest.millisatoshis]);
  const { balance } = useLightningWalletBalance();
  const { payInvoice, isPayingInvoice } = usePayInvoice({
    paymentRequest,
    amount: amount * MSAT_PER_SAT,
  });
  const onButtonPress = () => {
    payInvoice()
      .then((data) => {
        if (data.status !== PaymentStatus.FAILED)
          setFundedFromPeachWallet(address);
      })
      .catch((e) => {
        error(parseError(e));
        showErrorBanner("LIGHTNING_PAYMENT_FAILED");
      });
  };

  return (
    <>
      {fundedFromPeachWallet ? (
        <TradeInfo
          text={i18n("fundFromPeachWallet.funded")}
          IconComponent={
            <Icon id="checkCircle" size={16} color={tw.color("success-main")} />
          }
        />
      ) : (
        <Button
          ghost
          textColor={tw.color("primary-main")}
          iconId="sell"
          onPress={onButtonPress}
          disabled={balance.lightning <= amount}
          loading={isPayingInvoice}
        >
          {i18n("fundFromPeachWallet.button")}
        </Button>
      )}
    </>
  );
}
