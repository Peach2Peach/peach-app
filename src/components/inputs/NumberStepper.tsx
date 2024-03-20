import { TouchableOpacity, View } from "react-native";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { useTranslate } from "@tolgee/react";

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
  const { t } = useTranslate("form");
  const decrease = () => onChange(Math.max(value - 1, min));
  const increase = () => onChange(Math.min(value + 1, max));

  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={[tw`flex-row gap-3`, style]}>
      <TouchableOpacity
        onPress={decrease}
        accessibilityHint={t("number.decrease")}
        disabled={!canDecrease}
        style={!canDecrease && tw`opacity-50`}
      >
        <Icon id="minusCircle" size={24} color={tw.color("primary-main")} />
      </TouchableOpacity>
      <PeachText style={tw`h5 w-11 text-center`}>x {value}</PeachText>
      <TouchableOpacity
        onPress={increase}
        accessibilityHint={t("number.increase")}
        disabled={!canIncrease}
        style={!canIncrease && tw`opacity-50`}
      >
        <Icon id="plusCircle" size={24} color={tw.color("primary-main")} />
      </TouchableOpacity>
    </View>
  );
};
