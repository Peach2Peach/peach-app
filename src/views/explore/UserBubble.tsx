import { TouchableOpacity } from "react-native";
import { Icon } from "../../components/Icon";
import { PeachText } from "../../components/text/PeachText";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { PEACH_ID_LENGTH } from "../../utils/account/PEACH_ID_LENGTH";

export function UserBubble({
  userId,
  title,
  hideIcons = false,
}: {
  userId: string;
  title?: "buyer" | "seller";
  hideIcons?: boolean;
}) {
  const navigation = useStackNavigation();
  const goToUserProfile = () => {
    navigation.navigate("publicProfile", { userId });
  };

  const { isDarkMode } = useThemeStore();
  return (
    <TouchableOpacity
      onPress={goToUserProfile}
      style={tw`flex-row items-center px-3 py-1 border rounded-full gap-2px border-primary-main ${isDarkMode ? "bg-card" : "bg-primary-background-dark"} `}
      disabled={hideIcons}
    >
      <PeachText style={tw`subtitle-1`}>
        {title || `Peach${userId.slice(0, PEACH_ID_LENGTH)}`.toUpperCase()}
      </PeachText>
      {!hideIcons && (
        <>
          <Icon id="user" size={24} color={tw.color("black-100")} />
          <Icon id="eye" size={14} color={tw.color("primary-main")} />
        </>
      )}
    </TouchableOpacity>
  );
}
