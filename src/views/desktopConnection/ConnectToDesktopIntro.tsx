import { View } from "react-native";
import { Header } from "../../components/Header";
import { Icon } from "../../components/Icon";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

const PEACH_WEB_URL = "web.peachbitcoin.com";

export const ConnectToDesktopIntro = () => {
  const navigation = useStackNavigation();
  const { isDarkMode } = useThemeStore();

  const goToScanner = () => {
    navigation.navigate("connectToDesktopPage");
  };

  const urlHighlight = [
    {
      pattern: new RegExp(PEACH_WEB_URL.replace(/\./g, "\\."), "u"),
      style: tw`font-baloo-semibold text-primary-main`,
    },
  ];

  return (
    <Screen header={<ConnectToDesktopIntroHeader />}>
      <PeachScrollView
        contentContainerStyle={[tw`grow py-sm`, tw`md:py-md`]}
        contentStyle={tw`grow gap-6`}
      >
        <View style={[tw`items-center gap-4 px-md pt-2`, tw`md:px-lg md:pt-4`]}>
          <PeachText style={tw`h6 text-primary-main text-center`}>
            {i18n("connectToDesktop.intro.heading")}
          </PeachText>

          <ParsedPeachText style={tw`text-center`} parse={urlHighlight}>
            {i18n("connectToDesktop.page.instructions")}
          </ParsedPeachText>
        </View>

        <View style={[tw`px-md`, tw`md:px-lg`]}>
          <View
            style={[
              tw`rounded-2xl p-4 gap-3 border`,
              {
                backgroundColor: isDarkMode
                  ? "transparent"
                  : tw.color("warning-background-dark"),
                borderColor: tw.color("warning-dark-1"),
              },
            ]}
          >
            <View style={tw`flex-row items-center gap-2`}>
              <Icon
                id="alertTriangle"
                size={20}
                color={tw.color("warning-dark-2")}
              />
              <PeachText
                style={[tw`subtitle-1`, { color: tw.color("warning-dark-2") }]}
              >
                {i18n("connectToDesktop.intro.warning.title")}
              </PeachText>
            </View>

            <WarningBullet>
              <ParsedPeachText style={tw`body-s flex-1`} parse={urlHighlight}>
                {i18n("connectToDesktop.intro.warning.checkUrl")}
              </ParsedPeachText>
            </WarningBullet>

            <WarningBullet>
              <PeachText style={tw`body-s flex-1`}>
                {i18n("connectToDesktop.intro.warning.neverScanFromOthers")}
              </PeachText>
            </WarningBullet>
          </View>
        </View>

        <View
          style={[tw`grow justify-center items-center px-md`, tw`md:px-lg`]}
        >
          <Button onPress={goToScanner} iconId="camera">
            {i18n("connectToDesktop.page.scanQrCode")}
          </Button>
        </View>
      </PeachScrollView>
    </Screen>
  );
};

function WarningBullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={tw`flex-row gap-2 items-start`}>
      <View
        style={[
          tw`w-1 h-1 rounded-full mt-2`,
          { backgroundColor: tw.color("warning-dark-2") },
        ]}
      />
      {children}
    </View>
  );
}

function ConnectToDesktopIntroHeader() {
  return <Header title={i18n("settings.connectToDesktop")} />;
}
