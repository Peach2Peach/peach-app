// PinCodeDisplay
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";

const PinCodeBall = ({ isActive = false }: { isActive?: boolean }) => {
  const circleColor = isActive ? "#F56522" : tw.color("text-primary-mild-1");

  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      style={tw`w-[14px] h-[14px]`}
    >
      <Circle cx="7" cy="7" r="7" fill={circleColor} />
    </Svg>
  );
};

export const PinCodeDisplay = ({ currentPin }: { currentPin: string }) => {
  if (currentPin.length > 8) {
    throw new Error("Pin is bigger than 8");
  }

  const { isDarkMode } = useThemeStore();

  const outerBoxBackgroundColor = isDarkMode ? "#F4EEEB0D" : "#FEEDE5";

  const numberOfActiveBalls = currentPin.length;
  const numberOfInactiveBalls = 8 - currentPin.length;

  return (
    <View
      style={[
        tw`h-[69px] flex-col items-center justify-center self-stretch rounded-xl px-2 py-[22px]`,
        { backgroundColor: outerBoxBackgroundColor },
      ]}
    >
      <View style={tw`flex-row items-center gap-[18px]`}>
        {Array.from({ length: numberOfActiveBalls }).map((_, i) => (
          <PinCodeBall isActive={true} />
        ))}
        {Array.from({ length: numberOfInactiveBalls }).map((_, i) => (
          <PinCodeBall isActive={false} />
        ))}
      </View>
    </View>
  );
};
