import { useEffect } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { IconType } from "../../../assets/icons";
import { Icon } from "../../../components/Icon";
import { PeachText } from "../../../components/text/PeachText";
import { RainbowText } from "../../../components/text/RainbowText";
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
  | "testView"
  | "connectToDesktop"
  | "pasteDesktopConnection"
  | "mobilePendingActions";

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
  badge?: number;
};

export const SettingsItem = ({
  onPress: pressAction,
  title,
  iconId,
  warning,
  enabled,
  iconSize,
  badge,
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
    >
      <View style={tw`flex-row items-center flex-shrink gap-2`}>
        {title === "connectToDesktop" ? (
          <RainbowText text={i18n(`settings.${title}`)} style={tw`settings`} />
        ) : (
          <PeachText
            style={[
              tw`settings ${isDarkMode ? "text-black-25" : "text-black-65"}`,
              warning && tw`text-error-main`,
            ]}
          >
            {i18n(`settings.${title}`)}
          </PeachText>
        )}
        {!!badge && badge > 0 && <BouncingBadge count={badge} />}
      </View>
      <Icon
        id={iconId || "chevronRight"}
        style={iconSize || tw`w-8 h-8`}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

// one bounce (~550ms) then rest for the remainder of a 5s cycle
const BOUNCE_UP_MS = 150;
const BOUNCE_DOWN_MS = 400;
const BOUNCE_CYCLE_MS = 3000;

const BouncingBadge = ({ count }: { count: number }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, {
          duration: BOUNCE_UP_MS,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0, { duration: BOUNCE_DOWN_MS, easing: Easing.bounce }),
        withDelay(
          BOUNCE_CYCLE_MS - BOUNCE_UP_MS - BOUNCE_DOWN_MS,
          withTiming(0, { duration: 0 }),
        ),
      ),
      -1,
      false,
    );
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        tw`items-center justify-center px-2 rounded-full bg-primary-main min-w-6 h-6`,
        animatedStyle,
      ]}
    >
      <PeachText style={tw`button-medium text-primary-background-light-color`}>
        {count}
      </PeachText>
    </Animated.View>
  );
};
