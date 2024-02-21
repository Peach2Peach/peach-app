import { TouchableOpacity, ViewStyle } from "react-native";
import { IconType } from "../../../assets/icons";
import { Icon } from "../../../components/Icon";
import { PeachText } from "../../../components/text/PeachText";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import tw from "../../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

type SettingsTitle =
  | "myProfile"
  | "referrals"
  | "backups"
  | "networkFees"
  | "transactionBatching"
  | "paymentMethods"
  | "nodeSetup"
  | "refundAddress"
  | "payoutAddress"
  | "currency"
  | "language"
  | "contact"
  | "aboutPeach"
  | "testView";

export type SettingsItemProps = (
  | {
      title: SettingsTitle;
      onPress?: undefined;
    }
  | {
      onPress: () => void;
      title: string;
    }
) & {
  iconId?: IconType;
  iconSize?: ViewStyle;
  warning?: boolean;
  enabled?: boolean;
};

export const SettingsItem = ({
  onPress: pressAction,
  title,
  iconId,
  warning,
  enabled,
  iconSize,
}: SettingsItemProps) => {
  const { t } = useTranslate("settings");
  const navigation = useStackNavigation();
  const onPress = pressAction ? pressAction : () => navigation.navigate(title);
  const iconColor = warning
    ? tw.color("error-main")
    : enabled
      ? tw.color("primary-main")
      : tw.color("black-50");

  return (
    <TouchableOpacity
      style={tw`flex-row items-center justify-between`}
      onPress={onPress}
    >
      <PeachText
        style={[tw`settings text-black-65`, warning && tw`text-error-main`]}
      >
        {t(`settings.${title}`)}
      </PeachText>
      <Icon
        id={iconId || "chevronRight"}
        style={iconSize || tw`w-8 h-8`}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};
