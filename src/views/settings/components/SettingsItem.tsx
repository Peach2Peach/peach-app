import { TouchableOpacity, ViewStyle } from "react-native";
import { IconType } from "../../../assets/icons";
import { Icon } from "../../../components/Icon";
import { PeachText } from "../../../components/text/PeachText";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

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
  disabled?: boolean;
};

export const SettingsItem = ({
  onPress: pressAction,
  title,
  iconId,
  warning,
  enabled,
  iconSize,
  disabled,
}: SettingsItemProps) => {
  const navigation = useStackNavigation();
  const onPress = pressAction
    ? pressAction
    : () => navigation.navigate(title, {});
  const { isDarkMode } = useThemeStore();
  const iconColor = warning
    ? tw.color("error-main")
    : enabled
      ? tw.color("primary-main")
      : isDarkMode
        ? tw.color("black-25")
        : tw.color("black-50");

  return (
    <TouchableOpacity
      style={tw`flex-row items-center justify-between`}
      onPress={onPress}
      disabled={disabled}
    >
      <PeachText
        style={[
          tw`settings ${isDarkMode ? "text-black-25" : "text-black-65"}`,
          warning && tw`text-error-main`,
          disabled && tw`opacity-30`,
        ]}
      >
        {i18n(`settings.${title}`)}
      </PeachText>
      <Icon
        id={iconId || "chevronRight"}
        style={[iconSize || tw`w-8 h-8`, disabled && tw`opacity-30`]}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};
