import { Animated } from "react-native";
import { useIsMediumScreen } from "../../../../hooks/useIsMediumScreen";
import tw from "../../../../styles/tailwind";
import { FixedHeightText } from "../../../text/FixedHeightText";

type Props = ComponentProps & {
  width: number;
  opacity: Animated.Value | Animated.AnimatedInterpolation<string | number>;
};

const MEDIUM_SCREEN_HEIGHT = 9;
const SMALL_SCREEN_HEIGHT = 8;

export const ConfirmSliderLabel = ({
  children,
  width,
  opacity,
  style,
}: Props) => {
  const isMediumScreen = useIsMediumScreen();
  return (
    <Animated.View style={[style, tw`pt-1px`, { width, opacity }]}>
      <FixedHeightText
        height={isMediumScreen ? MEDIUM_SCREEN_HEIGHT : SMALL_SCREEN_HEIGHT}
        style={[tw`text-center button-medium`, tw`md:button-large`]}
        numberOfLines={1}
      >
        {children}
      </FixedHeightText>
    </Animated.View>
  );
};
