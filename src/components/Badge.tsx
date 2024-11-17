import { View } from "react-native";
import { badgeIconMap } from "../constants";
import { useThemeStore } from "../store/theme"; // Import theme store to check dark mode
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { useUserStatus } from "../views/publicProfile/useUserStatus";
import { Icon } from "./Icon";
import { InfoContainer } from "./InfoContainer";
import { FixedHeightText } from "./text/FixedHeightText";

type Props = {
  badgeName: Medal;
  isUnlocked?: boolean;
};

const BADGE_SIZE = 12;

export function Badge({ badgeName, isUnlocked }: Props) {
  const { isDarkMode } = useThemeStore(); // Access dark mode state
  const colorStyle = isUnlocked ? "text-primary-main" : isDarkMode ? "black-65" : "text-primary-mild-1";
  const iconId = badgeIconMap[badgeName];

  return (
    <InfoContainer
      enabled={!!isUnlocked}
      text={i18n(`peachBadges.${badgeName}`)}
      icon={<Icon id={iconId} color={tw.color(colorStyle)} size={BADGE_SIZE} />}
    />
  );
}

export function RepeatTraderBadge({ id }: { id: User["id"] }) {
  const { data } = useUserStatus(id);

  if (!data?.trades) return null;

  const hadBadExperience = data?.badExperience;
  const colorTheme = tw.color(hadBadExperience ? "error-main" : "primary-main");

  return (
    <InfoContainer
      enabled
      text={i18n("peachBadges.repeatTrader")}
      icon={
        <RepeatTraderIcon
          positive={!hadBadExperience}
          numberOfTrades={data.trades}
        />
      }
      color={colorTheme}
      textColor={colorTheme}
    />
  );
}

function RepeatTraderIcon({
  positive,
  numberOfTrades,
}: {
  positive: boolean;
  numberOfTrades: number;
}) {
  const colorTheme = tw.color(positive ? "primary-main" : "error-main");
  if (positive) {
    return (
      <View
        style={[
          tw`items-center justify-center border rounded-full px-2px`,
          { borderColor: colorTheme, height: BADGE_SIZE, minWidth: BADGE_SIZE },
        ]}
      >
        <FixedHeightText
          height={6}
          style={[
            tw`pt-px text-center subtitle-2 text-10px`,
            { color: colorTheme },
          ]}
        >
          {numberOfTrades}
        </FixedHeightText>
      </View>
    );
  }
  return <Icon id={"thumbsDown"} color={colorTheme} size={BADGE_SIZE} />;
}
