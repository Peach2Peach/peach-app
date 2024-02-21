import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, PanResponder } from "react-native";
import { round } from "../../../utils/math/round";

const MIN = -21;
const MAX = 21;
const DELTA = MAX - MIN;
export const KNOBWIDTH = 32;
export const DEFAULT_WIDTH = 260;

export const usePremiumSliderSetup = (
  premium: number,
  setPremium: (newPremium: number, isValid?: boolean | undefined) => void,
) => {
  const [isSliding, setIsSliding] = useState(false);
  const [trackWidth, setTrackWidth] = useState(DEFAULT_WIDTH);

  const pan = useRef(
    new Animated.Value(((premium - MIN) / DELTA) * trackWidth),
  ).current;

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
      const val = round((boundedX / trackWidth) * DELTA + MIN);
      setPremium(val);
    });

    return () => pan.removeAllListeners();
  }, [isSliding, pan, setPremium, trackWidth]);

  useEffect(() => {
    if (isSliding) return;
    pan.setValue(((premium - MIN) / DELTA) * trackWidth);
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
