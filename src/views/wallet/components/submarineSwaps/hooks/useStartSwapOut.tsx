import { SubmarinePair } from "boltz-swap-web-context/src/boltz-api/types";
import { useCallback } from "react";
import { useSetPopup } from "../../../../../components/popup/GlobalPopup";
import { CENT } from "../../../../../constants";
import { useHandleTransactionError } from "../../../../../hooks/error/useHandleTransactionError";
import { useLiquidFeeRate } from "../../../../../hooks/useLiquidFeeRate";
import { useShowErrorBanner } from "../../../../../hooks/useShowErrorBanner";
import { useSubmarineSwaps } from "../../../../../utils/boltz/query/useSubmarineSwaps";
import { sum } from "../../../../../utils/math/sum";
import { parseError } from "../../../../../utils/parseError";
import { handleTransactionError as parseTransactionError } from "../../../../../utils/wallet/error/handleTransactionError";
import { estimateMiningFees } from "../../../../../utils/wallet/liquid/estimateMiningFees";
import { peachLiquidWallet } from "../../../../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../../../../utils/wallet/useLiquidWalletState";
import { SetInvoicePopup } from "../SetInvoicePopup";

type EstimateSwapAmountProps = {
  limits: SubmarinePair["limits"];
  fees: SubmarinePair["fees"];
  feeRate: number;
  liquidBalance: number;
};

/**
 * @description estimate invoiceable amount that can be sent out after mining fees
 * by staging a transaction and after boltz fees
 */
const estimateSwapAmount = ({
  limits,
  fees,
  feeRate,
  liquidBalance,
}: EstimateSwapAmountProps) => {
  if (!peachLiquidWallet) throw Error("WALLET_NOT_READY");

  const { miningFees } = estimateMiningFees({
    feeRate,
    inputs: peachLiquidWallet.utxos,
    amount: peachLiquidWallet.utxos.map((utxo) => utxo.value).reduce(sum, 0),
  });

  const amountAfterLockup = Math.ceil(liquidBalance - miningFees);
  const swappableAmount =
    amountAfterLockup * (1 - fees.percentage / CENT) - fees.minerFees;
  return {
    swappableAmount: Math.floor(swappableAmount),
    miningFees,
  };
};

export const useStartSwapOut = () => {
  const { submarineList } = useSubmarineSwaps();
  const showErrorBanner = useShowErrorBanner();
  const setPopup = useSetPopup();
  const handleTransactionError = useHandleTransactionError();
  const feeRate = useLiquidFeeRate();
  const liquidBalance = useLiquidWalletState((state) => state.balance);

  // TODO determine if amount is above maximum > use max
  // TODO if change is available, ensure that change is sent to change address
  const startSwapOut = useCallback(() => {
    if (!peachLiquidWallet) throw Error("WALLET_NOT_READY");
    const pair = submarineList?.["L-BTC"].BTC;
    if (!pair) throw Error("SWAP_NOT_AVAILABLE_FOR_PAIR");

    const { fees, limits } = pair;
    if (!fees || !limits) throw Error("SWAP_CONDITIONS_UNKNOWN");

    if (liquidBalance < limits.minimal) {
      showErrorBanner("INSUFFICIENT_FUNDS", [
        String(limits.minimal),
        String(liquidBalance),
      ]);
      return false;
    }

    try {
      const { swappableAmount, miningFees } = estimateSwapAmount({
        limits,
        fees,
        feeRate,
        liquidBalance,
      });
      setPopup(
        <SetInvoicePopup amount={swappableAmount} miningFees={miningFees} />,
      );
    } catch (e) {
      handleTransactionError(parseTransactionError(parseError(e)));
    }

    return true;
  }, [
    feeRate,
    handleTransactionError,
    liquidBalance,
    setPopup,
    showErrorBanner,
    submarineList,
  ]);

  return startSwapOut;
};
