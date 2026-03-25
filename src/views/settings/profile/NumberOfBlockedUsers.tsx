import { View } from "react-native";
import { Button } from "../../../components/buttons/Button";
import { PeachText } from "../../../components/text/PeachText";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

export function NumberOfBlockedUsers({
  numberOfBlocked,
}: {
  numberOfBlocked: number;
}) {
  const navigation = useStackNavigation();
  const { isDarkMode } = useThemeStore();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <PeachText
          style={tw.style(
            `lowercase`,
            isDarkMode ? "text-backgroundLight-light" : "text-black-50",
          )}
        >
          {i18n("profile.user.blockedUsers")}:
        </PeachText>
        <PeachText
          style={tw.style(
            `subtitle-1`,
            isDarkMode ? "text-primary-mild-1" : "text-black-100",
          )}
        >
          {numberOfBlocked}
        </PeachText>
      </View>
      <View>
        <Button
          iconId="chevronRight"
          noBorder
          textColor={!isDarkMode ? tw.color("primary-main") : undefined}
          ghost={true}
          onPress={() => {
            navigation.navigate("blockedUsers");
          }}
          disabled={numberOfBlocked === 0}
          fullSpace={false}
        >
          {i18n("viewAll")}
        </Button>
      </View>
    </View>
  );
}
