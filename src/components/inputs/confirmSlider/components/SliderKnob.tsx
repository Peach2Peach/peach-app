import { Animated } from "react-native";
import { IconType } from "../../../../assets/icons";
import { useIsMediumScreen } from "../../../../hooks/useIsMediumScreen";
import tw from "../../../../styles/tailwind";
import { Icon } from "../../../Icon";
import { getBackgroundColor } from "../helpers/getBackgroundColor";

type Props = {
  enabled?: boolean;
  pan: Animated.Value;
  iconId: IconType;
};

const MEDIUM_SCREEN_ICON_SIZE = 18;
const SMALL_SCREEN_ICON_SIZE = 16;

export const SliderKnob = ({ enabled = true, pan, iconId }: Props) => {
  const isMediumScreen = useIsMediumScreen();
  const icon = {
    color: tw.color("primary-background-light-color"),
    size: isMediumScreen ? MEDIUM_SCREEN_ICON_SIZE : SMALL_SCREEN_ICON_SIZE,
  };

  return (
    <Animated.View
      style={[
        enabled
          ? { backgroundColor: getBackgroundColor(pan) }
          : tw`bg-black-25`,
        tw`flex-row items-center justify-center py-1 rounded-2xl gap-2px px-6px`,
        tw`md:px-8px md:py-6px md:gap-1`,
      ]}
    >
      <Icon id={enabled ? iconId : "slash"} {...icon} />
      <Icon id="chevronsRight" {...icon} />
    </Animated.View>
  );
};
