import { useEffect } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Icon } from "../../../components/Icon";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { Screen } from "../../../components/Screen";
import { Loading } from "../../../components/animation/Loading";
import { PeachText } from "../../../components/text/PeachText";
import { CopyAble } from "../../../components/ui/CopyAble";
import {
  STATUS_MAP,
  SwapInfo,
  isSwapPending,
  useBoltzSwapStore,
} from "../../../store/useBoltzSwapStore";
import tw from "../../../styles/tailwind";
import { useSwapStatus } from "../../../utils/boltz/query/useSwapStatus";
import i18n from "../../../utils/i18n";
import { keys } from "../../../utils/object/keys";
import { offerIdToHex } from "../../../utils/offer/offerIdToHex";

type Props = {
  swap: SwapInfo;
};
const SwapDetails = ({ swap }: Props) => {
  const [map, saveSwap] = useBoltzSwapStore(
    (state) => [state.map, state.saveSwap],
    shallow,
  );
  const mappedId = keys(map).find((k) => map[k].includes(swap.id));
  const isAlreadyComplete = STATUS_MAP.COMPLETED.includes(
    swap.status?.status || "",
  );
  const { status = swap.status } = useSwapStatus({
    id: swap.id,
    enabled: !isAlreadyComplete,
    refetch: false,
  });

  useEffect(() => {
    if (!swap.status || swap.status?.status !== status?.status) {
      saveSwap({ ...swap, status });
    }
  }, [saveSwap, status, swap]);

  const isComplete = STATUS_MAP.COMPLETED.includes(status?.status || "");
  const hasError = STATUS_MAP.ERROR.includes(status?.status || "");
  return (
    <View>
      <PeachText style={tw`h5`}>
        {!mappedId || isNaN(Number(mappedId))
          ? i18n("settings.swaps.swapOut")
          : offerIdToHex(mappedId)}
      </PeachText>
      <View key={swap.id} style={tw`flex-row items-center gap-4`}>
        {isComplete && (
          <Icon id="checkCircle" color={tw.color("success-main")} size={16} />
        )}
        {hasError && (
          <Icon id="crossOutlined" color={tw.color("error-main")} size={16} />
        )}
        {!isComplete && !hasError && <Loading style={tw`w-4 h-4`} />}
        <PeachText>{swap.id}</PeachText>
        {"expectedAmount" in swap && (
          <PeachText>
            {"expectedAmount" in swap &&
              i18n("currency.format.sats", String(swap.expectedAmount))}
          </PeachText>
        )}
        <CopyAble value={JSON.stringify(swap)} />
      </View>
    </View>
  );
};
export const Swaps = () => {
  const swaps = useBoltzSwapStore((state) => Object.values(state.swaps));
  const pendingSwaps = swaps.filter(isSwapPending);
  const failedSwaps = swaps.filter(
    (swap) =>
      swap.status?.status && STATUS_MAP.ERROR.includes(swap.status.status),
  );
  const completedSwaps = swaps.filter(
    (swap) =>
      swap.status?.status && STATUS_MAP.COMPLETED.includes(swap.status.status),
  );
  return (
    <Screen header={i18n("settings.swaps")}>
      <PeachScrollView
        style={tw`grow`}
        contentContainerStyle={tw`grow`}
        contentStyle={tw`gap-4`}
      >
        {pendingSwaps.map((swap) => (
          <SwapDetails key={swap.id} {...{ swap }} />
        ))}
        {failedSwaps.map((swap) => (
          <SwapDetails key={swap.id} {...{ swap }} />
        ))}
        {completedSwaps.map((swap) => (
          <SwapDetails key={swap.id} {...{ swap }} />
        ))}
      </PeachScrollView>
    </Screen>
  );
};
