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
  incrementType?: "offerCreation" | "maxPremium" | "minPremium";
  type?: "buy" | "sell";
};

const defaultIncrement = 0.1;
export const premiumBounds = { min: -21, max: 21 };

export const PremiumInput = ({
  premium,
  setPremium,
  incrementBy = defaultIncrement,
  incrementType = "offerCreation",
  type = "sell",
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
        ? tw`text-success-main`
        : tw`text-primary-main`;

  return (
    <View style={tw`flex-row items-center justify-between`}>
      <TouchableOpacity
        onPress={onMinusPress}
        accessibilityHint={i18n("number.decrease")}
        disabled={premium === premiumBounds.min}
      >
        <Icon
          id="minusCircle"
          size={24}
          color={
            premium === premiumBounds.min
              ? tw.color("gray-400")
              : type === "sell"
                ? tw.color("primary-main")
                : tw.color("success-main")
          }
        />
      </TouchableOpacity>
      <View style={tw`flex-row items-center justify-center gap-2 grow`}>
        <PeachText style={[tw`text-center`, textColor]}>
          {incrementType === "offerCreation"
            ? i18n(premium >= 0 ? "sell.premium" : "sell.discount")
            : incrementType === "maxPremium"
              ? i18n("filter.maxPremium")
              : i18n("filter.minPremium")}
          :
        </PeachText>
        <PremiumTextInput premium={premium} setPremium={setPremium} />
      </View>
      <TouchableOpacity
        onPress={onPlusPress}
        accessibilityHint={i18n("number.increase")}
        disabled={premium === premiumBounds.max}
      >
        <Icon
          id="plusCircle"
          size={24}
          color={
            premium === premiumBounds.max
              ? tw.color("gray-400")
              : type === "sell"
                ? tw.color("primary-main")
                : tw.color("success-main")
          }
        />
      </TouchableOpacity>
    </View>
  );
};
