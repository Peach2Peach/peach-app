import { Animated } from "react-native";
import { IconType } from "../../../../assets/icons";
import { useIsMediumScreen } from "../../../../hooks/useIsMediumScreen";
import tw from "../../../../styles/tailwind";
import { Icon } from "../../../Icon";
import { getBackgroundColor } from "../helpers/getBackgroundColor";

type Props = {
  enabled?: boolean;
  pan: Animated.Value;
  spin?: Animated.Value;
  iconId: IconType;
  isCallbackRunning?: boolean;
  isSuccess?: boolean;
};

const MEDIUM_SCREEN_ICON_SIZE = 18;
const SMALL_SCREEN_ICON_SIZE = 16;

export const SliderKnob = ({
  enabled = true,
  pan,
  spin,
  iconId,
  isCallbackRunning,
  isSuccess,
}: Props) => {
  const isMediumScreen = useIsMediumScreen();
  const icon = {
    color: tw.color("primary-background-light-color"),
    size: isMediumScreen ? MEDIUM_SCREEN_ICON_SIZE : SMALL_SCREEN_ICON_SIZE,
  };

  // sliders that report async progress only go green once the callback has
  // actually succeeded, not while the knob is being dragged to the end
  const usesAsyncFeedback = isCallbackRunning !== undefined;

  const getBackground = () => {
    if (!enabled) return tw`bg-black-25`;
    if (usesAsyncFeedback) {
      if (isSuccess)
        return { backgroundColor: tw.color("success-main") || "#65A519" };
      return { backgroundColor: tw.color("primary-main") || "#F56522" };
    }
    return { backgroundColor: getBackgroundColor(pan) };
  };

  const rotate = spin?.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        getBackground(),
        tw`flex-row items-center justify-center py-1 rounded-2xl gap-2px px-6px`,
        tw`md:px-8px md:py-6px md:gap-1`,
      ]}
    >
      <Animated.View
        style={isCallbackRunning && rotate ? { transform: [{ rotate }] } : null}
      >
        <Icon id={enabled ? iconId : "slash"} {...icon} />
      </Animated.View>
      <Icon id="chevronsRight" {...icon} />
    </Animated.View>
  );
};
