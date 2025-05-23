import { useCallback, useMemo } from "react";
import { sectionContainerPadding } from "../components/Section";
import { sliderWidth } from "../components/Slider";
import { horizontalTrackPadding } from "../components/SliderTrack";
import { trackMin } from "./constants";
import { useTradingAmountLimits } from "./useTradingAmountLimits";

export const useAmountInBounds = (trackWidth: number, type: "buy" | "sell") => {
  const [minLimit, maxLimit] = useTradingAmountLimits(type);
  const trackMax = useMemo(() => trackWidth - sliderWidth, [trackWidth]);
  const trackDelta = trackMax - trackMin;

  const getNewPosition = (pageX: number) =>
    pageX - horizontalTrackPadding - sectionContainerPadding;
  const getAmountPercentage = useCallback(
    (position: number) => (position - trackMin) / trackDelta,
    [trackDelta],
  );

  const getNewAmount = useCallback(
    (percentage: number) =>
      Math.round(minLimit + percentage * (maxLimit - minLimit)),
    [minLimit, maxLimit],
  );

  const getBoundedPosition =
    (bounds: readonly [number, number]) => (position: number) =>
      Math.max(bounds[0], Math.min(bounds[1], position));

  const getAmountInBounds = useCallback(
    (pageX: number, bounds: readonly [number, number]) => {
      const boundPosition = getBoundedPosition(bounds);
      const boundedPosition = boundPosition(getNewPosition(pageX));
      const newAmount = getNewAmount(getAmountPercentage(boundedPosition));
      return newAmount;
    },
    [getAmountPercentage, getNewAmount],
  );

  return getAmountInBounds;
};
