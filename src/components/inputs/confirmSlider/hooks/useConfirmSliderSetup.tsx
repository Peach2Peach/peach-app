import { useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, PanResponder } from "react-native";
import { useIsMediumScreen } from "../../../../hooks/useIsMediumScreen";
import { getNormalized } from "../../../../utils/math/getNormalized";

type Props = ComponentProps & {
  onConfirm: () => void;
  enabled: boolean;
};

export const defaultWidth = 260;
const MEDIUM_KNOB_WIDTH = 56;
const SMALL_KNOB_WIDTH = 46;

export const useConfirmSliderSetup = ({ enabled, onConfirm }: Props) => {
  const isMediumScreen = useIsMediumScreen();
  const knobWidth = isMediumScreen ? MEDIUM_KNOB_WIDTH : SMALL_KNOB_WIDTH;
  const [widthToSlide, setWidthToSlide] = useState(defaultWidth - knobWidth);

  const onLayout = (event: LayoutChangeEvent) => {
    if (!event.nativeEvent.layout.width) return;
    const width = Math.round(event.nativeEvent.layout.width);
    setWidthToSlide(width - knobWidth);
  };

  const pan = useRef(new Animated.Value(0)).current;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (!enabled) return false;
          const { dx, dy } = gestureState;
          // start gesture only if horizontal motion dominates
          return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 4;
        },

        onPanResponderGrant: () => {
          // gesture officially started
          pan.stopAnimation?.();
        },

        onPanResponderMove: (_, gestureState) => {
          if (!enabled) return;
          const x = gestureState.dx;
          pan.setValue(getNormalized(x, widthToSlide));
        },
        onPanResponderRelease: (_e, { dx }) => {
          const normalizedVal = getNormalized(dx, widthToSlide);
          if (normalizedVal >= 1 && enabled) onConfirm();
          Animated.timing(pan, {
            toValue: 0,
            duration: 100,
            delay: 10,
            useNativeDriver: false,
          }).start();
        },

        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
      }),
    [enabled, onConfirm, pan, widthToSlide],
  );

  return { panResponder, pan, widthToSlide, onLayout };
};
