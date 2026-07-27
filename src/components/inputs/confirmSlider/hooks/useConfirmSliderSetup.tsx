import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, LayoutChangeEvent, PanResponder } from "react-native";
import { useIsMediumScreen } from "../../../../hooks/useIsMediumScreen";
import { getNormalized } from "../../../../utils/math/getNormalized";

type Props = ComponentProps & {
  onConfirm: () => void;
  enabled: boolean;
  isCallbackRunning?: boolean;
  isSuccess?: boolean;
};

export const defaultWidth = 260;
const MEDIUM_KNOB_WIDTH = 56;
const SMALL_KNOB_WIDTH = 46;

export const useConfirmSliderSetup = ({
  enabled,
  onConfirm,
  isCallbackRunning,
  isSuccess,
}: Props) => {
  const isMediumScreen = useIsMediumScreen();
  const knobWidth = isMediumScreen ? MEDIUM_KNOB_WIDTH : SMALL_KNOB_WIDTH;
  const [widthToSlide, setWidthToSlide] = useState(defaultWidth - knobWidth);

  const onLayout = (event: LayoutChangeEvent) => {
    if (!event.nativeEvent.layout.width) return;
    const width = Math.round(event.nativeEvent.layout.width);
    setWidthToSlide(width - knobWidth);
  };

  const pan = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const wasCallbackRunning = useRef(false);

  useEffect(() => {
    if (isCallbackRunning) {
      wasCallbackRunning.current = true;
      // hold the knob at the end while the callback runs
      Animated.timing(pan, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else if (wasCallbackRunning.current) {
      // callback finished: stick at the end (green) on success, otherwise snap
      // back so the user can retry after a failure
      wasCallbackRunning.current = false;
      Animated.timing(pan, {
        toValue: isSuccess ? 1 : 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [isCallbackRunning, isSuccess, pan]);

  useEffect(() => {
    if (!isCallbackRunning) return undefined;
    // spin the knob icon continuously while the callback runs
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => {
      loop.stop();
      spin.setValue(0);
    };
  }, [isCallbackRunning, spin]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (!enabled || isCallbackRunning) return false;
          const { dx, dy } = gestureState;
          // start gesture only if horizontal motion dominates
          return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 4;
        },

        onPanResponderGrant: () => {
          if (isCallbackRunning) return;
          // gesture officially started
          pan.stopAnimation?.();
        },

        onPanResponderMove: (_, gestureState) => {
          if (!enabled || isCallbackRunning) return;
          const x = gestureState.dx;
          pan.setValue(getNormalized(x, widthToSlide));
        },
        onPanResponderRelease: (_e, { dx }) => {
          const normalizedVal = getNormalized(dx, widthToSlide);
          const isConfirmed = normalizedVal >= 1 && enabled;
          if (isConfirmed) onConfirm();
          const shouldHoldAtEnd =
            isConfirmed && isCallbackRunning !== undefined;
          if (!shouldHoldAtEnd) {
            Animated.timing(pan, {
              toValue: 0,
              duration: 100,
              delay: 10,
              useNativeDriver: false,
            }).start();
          }
        },

        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
      }),
    [enabled, isCallbackRunning, onConfirm, pan, widthToSlide],
  );

  return { panResponder, pan, spin, widthToSlide, onLayout };
};
