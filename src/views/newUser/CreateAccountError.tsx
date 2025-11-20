import { View } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { PeachText } from "../../components/text/PeachText";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export function CreateAccountError() {
  const { err } = useRoute<"createAccountError">().params;
  const navigation = useStackNavigation();
  const goToContact = () => navigation.navigate("contact", {});
  const goToRestoreBackup = () => navigation.navigate("restoreBackup");

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
      <View style={tw`items-center justify-between grow`}>
        <View style={tw`items-center justify-center gap-16 grow`}>
          <View>
            <PeachText
              style={tw`text-center h4 text-primary-background-light-color`}
            >
              {i18n("newUser.title.create")}
            </PeachText>
            <PeachText
              style={tw`text-center body-l text-primary-background-light-color`}
            >
              {i18n(`${err}.text`)}
            </PeachText>
          </View>
          <Icon
            id="userX"
            size={128}
            color={tw.color("primary-background-light-color")}
          />
        </View>

        <View style={tw`gap-2`}>
          <Button
            onPress={goToContact}
            style={tw`bg-primary-background-light-color`}
            textColor={tw.color("primary-main")}
          >
            {i18n("contactUs")}
          </Button>
          <Button onPress={goToRestoreBackup} ghost>
            {i18n("restore")}
          </Button>
        </View>
      </View>
    </Screen>
  );
}
