import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export function UserExistsForDevice() {
  const route = useRoute<"userExistsForDevice">();
  const navigation = useStackNavigation();
  const goToRestoreFromFile = () =>
    navigation.navigate("restoreBackup", { tab: "fileBackup" });
  const goToRestoreFromSeed = () =>
    navigation.navigate("restoreBackup", { tab: "seedPhrase" });
  const goToRestoreReputation = () =>
    navigation.navigate("restoreReputation", route.params);

  return (
    <Screen
      header={
        <Header
          title={i18n("welcome.welcomeToPeach.title")}
          theme="transparent"
          hideGoBackButton
        />
      }
      gradientBackground
    >
      <View style={tw`items-center justify-center gap-8 grow`}>
        <View>
          <PeachText
            style={tw`text-center h4 text-primary-background-light-color`}
          >
            {i18n("newUser.accountNotCreated")}
          </PeachText>
          <PeachText
            style={tw`text-center body-l text-primary-background-light-color`}
          >
            {i18n("newUser.youAlreadyHaveOne")}
          </PeachText>
        </View>
        <Icon
          id="userX"
          size={128}
          color={tw.color("primary-background-light-color")}
        />
        <View style={tw`items-center gap-8`}>
          <MenuItem onPress={goToRestoreFromFile}>
            {i18n("restoreBackup.restoreFromFile")}
          </MenuItem>
          <MenuItem onPress={goToRestoreFromSeed}>
            {i18n("restoreBackup.restoreFromSeed")}
          </MenuItem>
          <MenuItem onPress={goToRestoreReputation}>
            {i18n("restoreBackup.IdontHave")}
          </MenuItem>
        </View>
      </View>
    </Screen>
  );
}

type MenuItemProps = { onPress: () => void; children: ReactNode };
function MenuItem({ children, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`flex-row items-center justify-between w-60`}
    >
      <PeachText style={tw`settings text-primary-background-light-color`}>
        {children}
      </PeachText>
      <Icon
        id="chevronRight"
        style={tw`w-6 h-6`}
        color={tw.color("primary-background-light-color")}
      />
    </TouchableOpacity>
  );
}
