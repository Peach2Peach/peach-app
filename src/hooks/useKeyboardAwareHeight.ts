import { useEffect, useRef } from "react";
import { Animated, Keyboard, Platform } from "react-native";

interface UseKeyboardAwareHeightOptions {
  initialHeight: number;
  minHeight?: number;
  duration?: number;
}

const DEFAULT_MIN_HEIGHT = 100;
const DEFAULT_DURATION = 0;

export function useKeyboardAwareHeight({
  initialHeight,
  minHeight = DEFAULT_MIN_HEIGHT,
  duration = DEFAULT_DURATION,
}: UseKeyboardAwareHeightOptions) {
  const animatedHeight = useRef(new Animated.Value(initialHeight)).current;

  useEffect(() => {
    if (Platform.OS !== "android") return undefined;

    const keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        const targetHeight = Math.max(
          minHeight,
          initialHeight - e.endCoordinates.height,
        );
        Animated.timing(animatedHeight, {
          toValue: targetHeight,
          duration,
          useNativeDriver: false,
        }).start();
      },
    );

    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(animatedHeight, {
        toValue: initialHeight,
        duration,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [initialHeight, animatedHeight, minHeight, duration]);

  return animatedHeight;
}
