import { TouchableOpacity, View } from "react-native";
import tw from "../styles/tailwind";
import { round } from "../utils/math/round";
import { Icon } from "./Icon";
import { PremiumTextInput } from "./PremiumTextInput";
import { PeachText } from "./text/PeachText";
import { useTranslate } from "@tolgee/react";

type Props = {
  premium: number;
  setPremium: (newPremium: number) => void;
  incrementBy?: number;
};

const defaultIncrement = 0.1;
export const premiumBounds = { min: -21, max: 21 };

export const PremiumInput = ({
  premium,
  setPremium,
  incrementBy = defaultIncrement,
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

  const { t } = useTranslate();

  return (
    <View style={tw`flex-row items-center justify-between`}>
      <TouchableOpacity
        onPress={onMinusPress}
        accessibilityHint={t("number.decrease")}
      >
        <Icon id="minusCircle" size={24} color={tw.color("primary-main")} />
      </TouchableOpacity>
      <View style={tw`flex-row items-center justify-center gap-2 grow`}>
        <PeachText style={[tw`text-center`, textColor]}>
          {t({
            key: premium >= 0 ? "sell.premium" : "sell.discount",
            ns: "sell",
          })}
          :
        </PeachText>
        <PremiumTextInput premium={premium} setPremium={setPremium} />
      </View>
      <TouchableOpacity
        onPress={onPlusPress}
        accessibilityHint={t("number.increase")}
      >
        <Icon id="plusCircle" size={24} color={tw.color("primary-main")} />
      </TouchableOpacity>
    </View>
  );
};
