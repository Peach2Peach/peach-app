import { SwapStatus } from "boltz-swap-web-context/src/boltz-api/types";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { shallow } from "zustand/shallow";
import { BuyOffer, SellOffer } from "../../../../peach-api/src/@types/offer";
import { Icon } from "../../../components/Icon";
import { PeachScrollView } from "../../../components/PeachScrollView";
import { Loading } from "../../../components/animation/Loading";
import { useInterruptibleFunction } from "../../../components/matches/hooks/useInterruptibleFunction";
import { BitcoinAmountInfo } from "../../../components/statusCard/BitcoinAmountInfo";
import { StatusCard } from "../../../components/statusCard/StatusCard";
import { StatusInfo } from "../../../components/statusCard/StatusInfo";
import { exportFile } from "../../../hooks/exportFile";
import { useOfferDetail } from "../../../hooks/query/useOfferDetail";
import {
  STATUS_MAP,
  SwapInfo,
  getSwapAmount,
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
import {
  ClaimReverseSubmarineSwap,
  ClaimReverseSubmarineSwapProps,
} from "../../fundEscrow/components/ClaimReverseSubmarineSwap";
import {
  ClaimSubmarineSwap,
  ClaimSubmarineSwapProps,
} from "./submarineSwaps/ClaimSubmarineSwap";

type Props = {
  swap: SwapInfo;
};
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
  const amount = getSwapAmount(swap);

  const isAlreadyComplete = STATUS_MAP[swapType].COMPLETED.includes(
    swap.status?.status || "",
  );
  const canClaim =
    !STATUS_MAP[swapType].ERROR.includes(swap.status?.status || "") &&
    !STATUS_MAP[swapType].COMPLETED.includes(swap.status?.status || "");
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
  const isPending = !hasError && !isComplete;

  const downloadRefundFile = () =>
    exportFile(JSON.stringify(swap), `swap-${swap.id}.json`);

  const claimSubmarineSwapData = getClaimSubmarineSwapData({
    invoice: mappedId,
    swap,
  });
  const claimReverseSubmarineSwapData = getClaimReverseSubmarineSwapData({
    offer,
    swap,
    status,
  });
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (
      !swap.status?.status ||
      !STATUS_MAP[getSwapType(swap)].COMPLETED.includes(swap.status.status)
    ) {
      return;
    }
    opacityAnimation(opacity);
  }, [opacity, swap]);

  return (
    <Animated.View style={[tw`gap-1`, { opacity }]}>
      <StatusCard
        onPress={downloadRefundFile}
        color="info"
        statusInfo={
          <StatusInfo
            icon={
              isComplete ? (
                <Icon
                  id="checkCircle"
                  size={16}
                  color={tw.color("success-main")}
                />
              ) : isPending ? (
                <Loading style={tw`w-4 h-4`} />
              ) : (
                <Icon id="xCircle" size={16} color={tw.color("error-main")} />
              )
            }
            title={i18n(
              isComplete
                ? "wallet.swap.complete"
                : hasError
                  ? "wallet.swap.failed"
                  : "wallet.swap.pending",
            )}
            subtext={
              !mappedId || isNaN(Number(mappedId))
                ? i18n("wallet.swap.swapOut")
                : offerIdToHex(mappedId)
            }
          />
        }
        amountInfo={
          amount ? (
            <BitcoinAmountInfo chain="lightning" amount={amount} />
          ) : undefined
        }
      />
      {!!claimSubmarineSwapData && (
        <ClaimSubmarineSwap {...claimSubmarineSwapData} />
      )}
      {!!claimReverseSubmarineSwapData && (
        <ClaimReverseSubmarineSwap {...claimReverseSubmarineSwapData} />
      )}
    </Animated.View>
  );
};

const HIDE_COMPLETED_AFTER = 5000;
export const Swaps = () => {
  const swaps = useBoltzSwapStore((state) => Object.values(state.swaps));
  const pendingSwaps = swaps.filter(isSwapPending);
  const [justSeen, setJustSeen] = useState(pendingSwaps.map((swap) => swap.id));

  const { interruptibleFn: updateJustSeen } = useInterruptibleFunction(() => {
    setJustSeen(pendingSwaps.map((swap) => swap.id));
  }, HIDE_COMPLETED_AFTER);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateJustSeen, [pendingSwaps.length]);

  const failedSwaps = swaps.filter(
    (swap) =>
      swap.status?.status &&
      STATUS_MAP[getSwapType(swap)].ERROR.includes(swap.status.status),
  );
  const justCompletedSwaps = swaps.filter(
    (swap) =>
      swap.status?.status &&
      justSeen.includes(swap.id) &&
      STATUS_MAP[getSwapType(swap)].COMPLETED.includes(swap.status.status),
  );
  return (
    <PeachScrollView
      style={tw`grow`}
      contentContainerStyle={tw`grow`}
      contentStyle={tw`gap-2`}
    >
      {justCompletedSwaps.map((swap) => (
        <SwapDetails key={swap.id} {...{ swap }} />
      ))}
      {pendingSwaps.map((swap) => (
        <SwapDetails key={swap.id} {...{ swap }} />
      ))}
      {failedSwaps.map((swap) => (
        <SwapDetails key={swap.id} {...{ swap }} />
      ))}
    </PeachScrollView>
  );
};

function getClaimReverseSubmarineSwapData({
  offer,
  swap,
  status,
}: {
  offer?: SellOffer | BuyOffer;
  swap: SwapInfo;
  status?: SwapStatus;
}): ClaimReverseSubmarineSwapProps | undefined {
  if (!peachLiquidWallet) return undefined;
  if (!status) return undefined;
  if (!STATUS_MAP.REVERSE.CLAIM.includes(status.status)) return undefined;
  if (!offer || !isSellOffer(offer) || !offer.escrows.liquid) return undefined;
  if (!isSwapPending(swap)) return undefined;
  if (!swap.preimage) return undefined;
  if (!("invoice" in swap)) return undefined;
  return {
    offerId: offer.id,
    address: offer.escrows.liquid,
    swapStatus: status,
    preimage: swap.preimage,
    swapInfo: swap,
    keyPairWIF: peachLiquidWallet.getInternalKeyPair(swap.keyPairIndex).toWIF(),
  };
}

function getClaimSubmarineSwapData({
  invoice,
  swap,
}: {
  invoice?: string;
  swap: SwapInfo;
}): ClaimSubmarineSwapProps | undefined {
  if (!peachLiquidWallet) return undefined;
  if (!invoice) return undefined;
  if (!swap.status) return undefined;
  if (!STATUS_MAP.SUBMARINE.CLAIM.includes(swap.status?.status))
    return undefined;
  if (!("expectedAmount" in swap)) return undefined;
  return {
    invoice,
    swapInfo: swap,
    keyPairWIF: peachLiquidWallet.getInternalKeyPair(swap.keyPairIndex).toWIF(),
  };
}

const DELAY = 4000;
function opacityAnimation(opacity: Animated.Value) {
  Animated.sequence([
    Animated.delay(DELAY),
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }),
  ]).start();
}
