import { useEffect } from "react";
import { View } from "react-native";
import { shallow } from "zustand/shallow";
import { Icon } from "../../../components/Icon";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { Screen } from "../../../components/Screen";
import { Loading } from "../../../components/animation/Loading";
import { PeachText } from "../../../components/text/PeachText";
import { CopyAble } from "../../../components/ui/CopyAble";
import { useOfferDetail } from "../../../hooks/query/useOfferDetail";
import {
  STATUS_MAP,
  SwapInfo,
  getSwapType,
  isSwapPending,
  useBoltzSwapStore,
} from "../../../store/useBoltzSwapStore";
import tw from "../../../styles/tailwind";
import { useSwapStatus } from "../../../utils/boltz/query/useSwapStatus";
import i18n from "../../../utils/i18n";
import { keys } from "../../../utils/object/keys";
import { isSellOffer } from "../../../utils/offer/isSellOffer";
import { offerIdToHex } from "../../../utils/offer/offerIdToHex";
import { peachLiquidWallet } from "../../../utils/wallet/setWallet";
import { ClaimReverseSubmarineSwap } from "../../fundEscrow/components/ClaimReverseSubmarineSwap";
import { ClaimSubmarineSwap } from "../../wallet/components/submarineSwaps/ClaimSubmarineSwap";

type Props = {
  swap: SwapInfo;
};
// eslint-disable-next-line complexity
const SwapDetails = ({ swap }: Props) => {
  const [map, saveSwap] = useBoltzSwapStore(
    (state) => [state.map, state.saveSwap],
    shallow,
  );
  const mappedId = keys(map).find((k) => map[k].includes(swap.id));
  const { offer } = useOfferDetail(
    !isNaN(Number(mappedId)) ? mappedId : undefined,
  );
  const swapType = getSwapType(swap);

  const isAlreadyComplete = STATUS_MAP[swapType].COMPLETED.includes(
    swap.status?.status || "",
  );
  const canClaim = STATUS_MAP[swapType].CLAIM.includes(
    swap.status?.status || "",
  );
  const { status = swap.status } = useSwapStatus({
    id: swap.id,
    enabled: !isAlreadyComplete,
    refetch: canClaim,
  });

  useEffect(() => {
    if (!status?.status) return;
    if (!swap.status || swap.status?.status !== status?.status) {
      saveSwap({ ...swap, status });
    }
  }, [saveSwap, status, swap]);

  const isComplete = STATUS_MAP[swapType].COMPLETED.includes(
    status?.status || "",
  );
  const hasError = STATUS_MAP[swapType].ERROR.includes(status?.status || "");

  const claimSubmarineSwapData =
    peachLiquidWallet &&
    mappedId &&
    swap.status &&
    STATUS_MAP.SUBMARINE.CLAIM.includes(swap.status?.status) &&
    "expectedAmount" in swap
      ? {
          invoice: mappedId,
          swapInfo: swap,
          keyPairWIF: peachLiquidWallet
            .getInternalKeyPair(swap.keyPairIndex)
            .toWIF(),
        }
      : undefined;
  const claimReverseSubmarineSwapData =
    peachLiquidWallet &&
    status &&
    offer &&
    isSellOffer(offer) &&
    offer.escrows.liquid &&
    mappedId &&
    isSwapPending(swap) &&
    swap.preimage &&
    "invoice" in swap
      ? {
          offerId: mappedId,
          address: offer.escrows.liquid,
          swapStatus: status,
          preimage: swap.preimage,
          swapInfo: swap,
          keyPairWIF: peachLiquidWallet
            .getInternalKeyPair(swap.keyPairIndex)
            .toWIF(),
        }
      : undefined;
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
      {!!claimSubmarineSwapData && (
        <ClaimSubmarineSwap {...claimSubmarineSwapData} />
      )}
      {!!claimReverseSubmarineSwapData && (
        <ClaimReverseSubmarineSwap {...claimReverseSubmarineSwapData} />
      )}
    </View>
  );
};
export const Swaps = () => {
  const swaps = useBoltzSwapStore((state) => Object.values(state.swaps));
  const pendingSwaps = swaps.filter(isSwapPending);
  const failedSwaps = swaps.filter(
    (swap) =>
      swap.status?.status &&
      STATUS_MAP[getSwapType(swap)].ERROR.includes(swap.status.status),
  );
  const completedSwaps = swaps.filter(
    (swap) =>
      swap.status?.status &&
      STATUS_MAP[getSwapType(swap)].COMPLETED.includes(swap.status.status),
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
