import { useTranslate } from "@tolgee/react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";

export function AccountCreated() {
  const { t } = useTranslate();
  return (
    <Screen
      header={
        <Header
          title={t("welcome.welcomeToPeach.title", { ns: "welcome" })}
          theme="transparent"
          hideGoBackButton
        />
      }
      gradientBackground
    >
      <View style={tw`items-center justify-center gap-16 grow`}>
        <View>
          <PeachText style={tw`text-center h4 text-primary-background-light`}>
            {t("newUser.title.accountCreated")}
          </PeachText>
          <PeachText
            style={tw`text-center body-l text-primary-background-light`}
          >
            {t("newUser.welcome")}
          </PeachText>
        </View>
        <Icon
          id="userCheck"
          size={128}
          color={tw.color("primary-background-light")}
        />
      </View>
    </Screen>
  );
}
