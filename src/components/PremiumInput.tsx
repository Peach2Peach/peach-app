import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  MAXIMUM_CHF_AMOUNT_OF_OFFER,
  MINIMUM_CHF_AMOUNT_OF_OFFER,
} from "../constants";
import tw from "../styles/tailwind";
import i18n, { useI18n } from "../utils/i18n";
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
  currentAmount: number;
  currentCHFPrice: number;
};

const defaultIncrement = 0.1;
export const premiumBounds = { min: -21, max: 21 };

export const PremiumInput = ({
  premium,
  setPremium,
  incrementBy = defaultIncrement,
  incrementType = "offerCreation",
  type = "sell",
  currentAmount,
  currentCHFPrice,
}: Props) => {
  const baseCHF = (currentAmount / 100_000_000) * currentCHFPrice;
  const boundsAreComputable = baseCHF > 0;

  const minimumPremiumAllowed = boundsAreComputable
    ? Math.ceil((MINIMUM_CHF_AMOUNT_OF_OFFER / baseCHF - 1) * 100)
    : premiumBounds.min;

  const maximumPremiumAllowed = boundsAreComputable
    ? Math.floor((MAXIMUM_CHF_AMOUNT_OF_OFFER / baseCHF - 1) * 100)
    : premiumBounds.max;

  useEffect(() => {
    if (!boundsAreComputable) return;
    if (premium > maximumPremiumAllowed) setPremium(maximumPremiumAllowed);
    else if (premium < minimumPremiumAllowed) setPremium(minimumPremiumAllowed);
  }, [
    boundsAreComputable,
    premium,
    minimumPremiumAllowed,
    maximumPremiumAllowed,
    setPremium,
  ]);

  useI18n();
  const onMinusPress = () => {
    const newPremium = round(
      Math.max(premium - incrementBy, minimumPremiumAllowed),
      2,
    );
    setPremium(newPremium);
  };

  const onPlusPress = () => {
    const newPremium = round(
      Math.min(premium + incrementBy, maximumPremiumAllowed),
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
        disabled={premium === minimumPremiumAllowed}
      >
        <Icon
          id="minusCircle"
          size={24}
          color={
            premium === minimumPremiumAllowed
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
        <PremiumTextInput
          premium={premium}
          setPremium={setPremium}
          minimumPremiumAllowed={minimumPremiumAllowed}
          maximumPremiumAllowed={maximumPremiumAllowed}
        />
      </View>
      <TouchableOpacity
        onPress={onPlusPress}
        accessibilityHint={i18n("number.increase")}
        disabled={premium === maximumPremiumAllowed}
      >
        <Icon
          id="plusCircle"
          size={24}
          color={
            premium === maximumPremiumAllowed
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
