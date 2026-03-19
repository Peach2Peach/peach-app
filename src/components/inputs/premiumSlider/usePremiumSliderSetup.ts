import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, PanResponder } from "react-native";
import {
  MAXIMUM_CHF_AMOUNT_OF_OFFER,
  MINIMUM_CHF_AMOUNT_OF_OFFER,
} from "../../../constants";
import { round } from "../../../utils/math/round";

export const KNOBWIDTH = 32;
export const DEFAULT_WIDTH = 260;

export const usePremiumSliderSetup = (
  premium: number,
  setPremium: (newPremium: number, isValid?: boolean | undefined) => void,
  currentCHFPrice: number,
  currentAmount: number,
) => {
  const baseCHF = (currentAmount / 100_000_000) * currentCHFPrice;

  const minimumPremiumAllowed = Math.ceil(
    (MINIMUM_CHF_AMOUNT_OF_OFFER / baseCHF - 1) * 100,
  );

  const maximumPremiumAllowed = Math.floor(
    (MAXIMUM_CHF_AMOUNT_OF_OFFER / baseCHF - 1) * 100,
  );

  const MIN = minimumPremiumAllowed;
  const MAX = maximumPremiumAllowed;

  const [isSliding, setIsSliding] = useState(false);
  const [trackWidth, setTrackWidth] = useState(DEFAULT_WIDTH);

  /**
   * Convert premium → slider X position
   */
  const premiumToX = (value: number) => {
    const half = trackWidth / 2;

    if (value <= 0) {
      return ((value - MIN) / (0 - MIN)) * half;
    }

    return half + (value / MAX) * half;
  };

  /**
   * Convert slider X position → premium
   */
  const xToPremium = (x: number) => {
    const half = trackWidth / 2;

    if (x <= half) {
      const ratio = x / half;
      return round(MIN + ratio * (0 - MIN));
    }

    const ratio = (x - half) / half;
    return round(ratio * MAX);
  };

  const pan = useRef(new Animated.Value(premiumToX(premium))).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsSliding(true);
      },
      onPanResponderMove: Animated.event([null, { dx: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        setIsSliding(false);
        pan.flattenOffset();
      },
      onShouldBlockNativeResponder: () => true,
    }),
  ).current;

  useEffect(() => {
    if (!isSliding) return undefined;
    pan.extractOffset();
    pan.addListener((props) => {
      const boundedX = props.value < 0 ? 0 : Math.min(props.value, trackWidth);
      const val = xToPremium(boundedX);
      setPremium(val);
    });

    return () => pan.removeAllListeners();
  }, [isSliding, pan, setPremium, trackWidth]);

  useEffect(() => {
    if (isSliding) return;
    pan.setValue(premiumToX(premium));
  }, [isSliding, pan, trackWidth, premium]);

  const onLayout = (event: LayoutChangeEvent) => {
    if (!event.nativeEvent.layout.width) return;
    const newTrackWidth = event.nativeEvent.layout.width - KNOBWIDTH;

    setTrackWidth(newTrackWidth);
  };

  return {
    pan,
    panResponder,
    onLayout,
    trackWidth,
    knobWidth: KNOBWIDTH,
    min: MIN,
    max: MAX,
  };
};
