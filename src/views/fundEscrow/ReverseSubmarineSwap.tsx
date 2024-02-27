import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { Loading } from "../../components/animation/Loading";
import { LightningInvoice } from "../../components/bitcoin/LightningInvoice";
import { ErrorBox } from "../../components/ui/ErrorBox";
import { useBoltzSwapStore } from "../../store/useBoltzSwapStore";
import { usePostReverseSubmarineSwap } from "../../utils/boltz/query/usePostReverseSubmarineSwap";
import { useSwapStatus } from "../../utils/boltz/query/useSwapStatus";
import { ClaimReverseSubmarineSwap } from "./components/ClaimReverseSubmarineSwap";

export type Props = {
  offerId: string;
  address: string;
  amount: number;
};

export const ReverseSubmarineSwap = ({ offerId, address, amount }: Props) => {
  const { data, error } = usePostReverseSubmarineSwap({ address, amount });
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

  if (error?.message) return <ErrorBox>{error.message}</ErrorBox>;
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

  return <LightningInvoice invoice={swapInfo.invoice} />;
};
