import { TouchableOpacity, View } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = ComponentProps & {
  value: number;
  onChange: (number: number) => void;
  min?: number;
  max?: number;
};
export const NumberStepper = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  style,
}: Props) => {
  const decrease = () => onChange(Math.max(value - 1, min));
  const increase = () => onChange(Math.min(value + 1, max));

  const canDecrease = value > min;
  const canIncrease = value < max;

  const { isDarkMode } = useThemeStore();

  return (
    <View style={[tw`flex-row gap-3`, style]}>
      <TouchableOpacity
        onPress={decrease}
        accessibilityHint={i18n("number.decrease")}
        disabled={!canDecrease}
        style={!canDecrease && tw`opacity-50`}
      >
        <Icon id="minusCircle" size={24} color={tw.color("primary-main")} />
      </TouchableOpacity>
      <PeachText
        style={[
          tw`text-center h5 w-11`,
          tw`text-${isDarkMode ? "backgroundLight-light" : "black-100"}`,
        ]}
      >
        x {value}
      </PeachText>
      <TouchableOpacity
        onPress={increase}
        accessibilityHint={i18n("number.increase")}
        disabled={!canIncrease}
        style={!canIncrease && tw`opacity-50`}
      >
        <Icon id="plusCircle" size={24} color={tw.color("primary-main")} />
      </TouchableOpacity>
    </View>
  );
};
