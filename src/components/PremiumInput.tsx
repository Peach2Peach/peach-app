import { TouchableOpacity, View } from "react-native";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { round } from "../utils/math/round";
import { Icon } from "./Icon";
import { PremiumTextInput } from "./PremiumTextInput";
import { PeachText } from "./text/PeachText";

type Props = {
  premium: number;
  setPremium: (newPremium: number) => void;
  incrementBy?: number;
  isBuy?: boolean;
};

const defaultIncrement = 0.1;
export const premiumBounds = { min: -21, max: 21 };

export const PremiumInput = ({
  premium,
  setPremium,
  incrementBy = defaultIncrement,
  isBuy = false,
}: Props) => {
  const onMinusPress = () => {
    const newPremium = round(
      Math.max(premium - incrementBy, premiumBounds.min),
      2,
    );
    setPremium(newPremium);
  };

  const onPlusPress = () => {
    const newPremium = round(
      Math.min(premium + incrementBy, premiumBounds.max),
      2,
    );
    setPremium(newPremium);
  };

  const textColor =
    premium === 0
      ? tw`text-black-100`
      : premium > 0
        ? isBuy
          ? tw`text-black-100`
          : tw`text-success-main`
        : tw`text-primary-main`;

  const buttonColor = isBuy
    ? tw.color("success-main")
    : tw.color("primary-main");

  return (
    <View style={tw`flex-row items-center justify-between`}>
      <TouchableOpacity
        onPress={onMinusPress}
        accessibilityHint={i18n("number.decrease")}
      >
        <Icon id="minusCircle" size={24} color={buttonColor} />
      </TouchableOpacity>
      <View style={tw`flex-row items-center justify-center gap-2 grow`}>
        <PeachText style={[tw`text-center`, textColor]}>
          {i18n(
            premium >= 0
              ? isBuy
                ? "buy.maxPremium"
                : "sell.premium"
              : "sell.discount",
          )}
          :
        </PeachText>
        <PremiumTextInput premium={premium} setPremium={setPremium} />
      </View>
      <TouchableOpacity
        onPress={onPlusPress}
        accessibilityHint={i18n("number.increase")}
      >
        <Icon id="plusCircle" size={24} color={buttonColor} />
      </TouchableOpacity>
    </View>
  );
};
