import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, PanResponder } from "react-native";
import {
  MAXIMUM_CHF_AMOUNT_OF_OFFER,
  MINIMUM_CHF_AMOUNT_OF_OFFER,
} from "../../../constants";
import { round } from "../../../utils/math/round";
import { premiumBounds } from "../../PremiumInput";

export const KNOBWIDTH = 32;
export const DEFAULT_WIDTH = 260;

const SLIDER_BOUND = 50;

export const usePremiumSliderSetup = (
  premium: number,
  setPremium: (newPremium: number, isValid?: boolean | undefined) => void,
  currentCHFPrice: number,
  currentAmount: number,
) => {
  const baseCHF = (currentAmount / 100_000_000) * currentCHFPrice;
  const boundsAreComputable = baseCHF > 0;

  const minimumPremiumAllowed = boundsAreComputable
    ? Math.ceil((MINIMUM_CHF_AMOUNT_OF_OFFER / baseCHF - 1) * 100)
    : premiumBounds.min;

  const maximumPremiumAllowed = boundsAreComputable
    ? Math.floor((MAXIMUM_CHF_AMOUNT_OF_OFFER / baseCHF - 1) * 100)
    : premiumBounds.max;

  const MIN = minimumPremiumAllowed;
  const MAX = maximumPremiumAllowed;
  const sliderMin = Math.max(minimumPremiumAllowed, -SLIDER_BOUND);
  const sliderMax = Math.min(maximumPremiumAllowed, SLIDER_BOUND);

  const [trackWidth, setTrackWidth] = useState(DEFAULT_WIDTH);

  // Refs so PanResponder callbacks always read fresh values without stale closures
  const isSlidingRef = useRef(false);
  const trackWidthRef = useRef(trackWidth);
  const sliderMinRef = useRef(sliderMin);
  const sliderMaxRef = useRef(sliderMax);
  trackWidthRef.current = trackWidth;
  sliderMinRef.current = sliderMin;
  sliderMaxRef.current = sliderMax;

  /**
   * Convert premium → slider X position
   */
  const premiumToX = (value: number) => {
    const clamped = Math.max(sliderMin, Math.min(sliderMax, value));
    const half = trackWidth / 2;

    if (clamped <= 0) {
      return ((clamped - sliderMin) / (0 - sliderMin)) * half;
    }

    return half + (clamped / sliderMax) * half;
  };

  const pan = useRef(new Animated.Value(premiumToX(premium))).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isSlidingRef.current = true;
        // Must be called synchronously here — doing it in a useEffect causes
        // a render-cycle delay that makes the knob jump on Android.
        pan.extractOffset();
        pan.addListener(({ value }) => {
          const tw = trackWidthRef.current;
          const sMin = sliderMinRef.current;
          const sMax = sliderMaxRef.current;
          const boundedX = Math.max(0, Math.min(value, tw));
          const half = tw / 2;
          const val =
            boundedX <= half
              ? round(sMin + (boundedX / half) * -sMin)
              : round(((boundedX - half) / half) * sMax);
          setPremium(val);
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        isSlidingRef.current = false;
        pan.removeAllListeners();
        pan.flattenOffset();
      },
      onPanResponderTerminate: () => {
        isSlidingRef.current = false;
        pan.removeAllListeners();
        pan.flattenOffset();
      },
      onShouldBlockNativeResponder: () => true,
    }),
  ).current;

  // Sync knob position when premium changes externally (e.g. +/- buttons)
  useEffect(() => {
    if (isSlidingRef.current) return;
    pan.setValue(premiumToX(premium));
  }, [premium, trackWidth, sliderMin, sliderMax]);

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
    sliderMin,
    sliderMax,
  };
};
