import { useCallback, useEffect, useRef } from "react";
import { Animated, Pressable, StyleProp, ViewStyle } from "react-native";
import { Icon } from "../../../components/Icon";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { PeachText } from "../../../components/text/PeachText";
import { TradingConditionsUpdatePopup } from "../../../popups/TradingConditionsUpdatePopup";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

const PULSE_DURATION = 900;
const PULSE_MIN_OPACITY = 0.45;

/**
 * @description draws attention to the temporary trading conditions while the
 * single-sig escrow is in place, and opens the full explanation on press
 */
export function TradingConditionsBanner({
  style,
}: {
  style?: StyleProp<ViewStyle>;
}) {
  const setPopup = useSetPopup();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: PULSE_MIN_OPACITY,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const showPopup = useCallback(
    () => setPopup(<TradingConditionsUpdatePopup />),
    [setPopup],
  );

  return (
    <Animated.View style={[style, { opacity }]}>
      <Pressable
        onPress={showPopup}
        style={tw`flex-row items-center justify-center gap-2 px-3 py-2 rounded-xl bg-info-background`}
      >
        <Icon id="info" size={16} color={tw.color("info-main")} />
        <PeachText style={tw`shrink body-s text-info-dark`}>
          {i18n("tradingConditionsUpdate.banner")}
        </PeachText>
      </Pressable>
    </Animated.View>
  );
}
