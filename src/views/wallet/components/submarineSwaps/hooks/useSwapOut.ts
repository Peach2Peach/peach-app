import { useCallback, useState } from "react";
import { shallow } from "zustand/shallow";
import { useShowErrorBanner } from "../../../../../hooks/useShowErrorBanner";
import { useBoltzSwapStore } from "../../../../../store/useBoltzSwapStore";
import { SubmarineAPIResponse } from "../../../../../utils/boltz/api/postSubmarineSwap";
import { postSubmarineSwapQuery } from "../../../../../utils/boltz/query/postSubmarineSwapQuery";
import { parseError } from "../../../../../utils/parseError";
import { peachAPI } from "../../../../../utils/peachAPI";
import { buildTransaction } from "../../../../../utils/wallet/liquid/buildTransaction";
import { peachLiquidWallet } from "../../../../../utils/wallet/setWallet";

const getSwapByInvoice = (invoice: string) => {
  const swapId = useBoltzSwapStore.getState().map[invoice][0];
  const swap = useBoltzSwapStore.getState().swaps[swapId];
  if (!swap) throw Error("SWAP_NOT_FOUND");

  return {
    swapInfo: swap as SubmarineAPIResponse,
    keyPairIndex: swap.keyPairIndex,
    keyPairWIF: peachLiquidWallet
      ?.getInternalKeyPair(swap.keyPairIndex)
      .toWIF(),
  };
};

type UseSwapOutProps = {
  miningFees: number;
  invoice: string;
};
export const useSwapOut = ({ miningFees, invoice }: UseSwapOutProps) => {
  const [postSwapInProgress, setPostSwapInProgress] = useState(false);
  const showErrorBanner = useShowErrorBanner();
  const [swaps, saveSwap, mapSwap] = useBoltzSwapStore(
    (state) => [state.swaps, state.saveSwap, state.mapSwap],
    shallow,
  );
  const swap = swaps[invoice] ? getSwapByInvoice(invoice) : undefined;

  const swapOut = useCallback(async () => {
    setPostSwapInProgress(true);

    try {
      if (!invoice) throw Error("INVOICE_UNDEFINED");
      if (!peachLiquidWallet) throw Error("WALLET_NOT_READY");

      const { swapInfo, keyPairIndex } =
        swap || (await postSubmarineSwapQuery({ invoice }));

      if (!("address" in swapInfo) || !swapInfo.address)
        throw Error("NO_LOCKUP_ADDRESS");
      if (!swaps[invoice]) {
        saveSwap({ ...swapInfo, keyPairIndex });
        mapSwap(invoice, swapInfo.id);
      }

      const lockUpTransaction = buildTransaction({
        recipient: swapInfo.address,
        amount: swapInfo.expectedAmount,
        miningFees,
        inputs: peachLiquidWallet.utxos,
      });

      const { error } = await peachAPI.public.liquid.postTx({
        tx: lockUpTransaction.toHex(),
      });

      if (error) throw Error(error.error);

      peachLiquidWallet.syncWallet();
    } catch (e) {
      showErrorBanner(parseError(e));
      setPostSwapInProgress(false);
    }
  }, [invoice, mapSwap, miningFees, saveSwap, showErrorBanner, swap, swaps]);

  return {
    swapOut,
    postSwapInProgress,
    swapInfo: swap?.swapInfo,
    keyPairWIF: swap?.keyPairWIF,
  };
};
