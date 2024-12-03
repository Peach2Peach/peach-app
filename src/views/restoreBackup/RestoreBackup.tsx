import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Header, HeaderIcon } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { useDrawerState } from "../../components/drawer/useDrawerState";
import { fullScreenTabNavigationScreenOptions } from "../../constants";
import { useLanguage } from "../../hooks/useLanguage";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { RestoreFromFile } from "./RestoreFromFile";
import { RestoreFromSeed } from "./RestoreFromSeed";

const RestoreBackupTab = createMaterialTopTabNavigator();
const tabs = ["fileBackup", "seedPhrase"] as const;

export const RestoreBackup = () => {
  const { tab: initialRouteName = "fileBackup" } =
    useRoute<"restoreBackup">().params || {};

  return (
    <Screen style={tw`px-0`} header={<OnboardingHeader />} gradientBackground>
      <RestoreBackupTab.Navigator
        initialRouteName={initialRouteName}
        sceneContainerStyle={[tw`pb-2 px-sm`, tw`md:px-md`]}
        screenOptions={{
          ...fullScreenTabNavigationScreenOptions,
          tabBarIndicatorStyle: tw`bg-primary-background-light-color`,
          tabBarActiveTintColor: tw.color("primary-background-light-color"),
          tabBarInactiveTintColor: tw.color("primary-mild-1"),
        }}
      >
        {tabs.map((tab) => (
          <RestoreBackupTab.Screen
            key={tab}
            name={tab}
            options={{ title: `${i18n(`settings.backups.${tab}`)}` }}
            component={tab === "fileBackup" ? RestoreFromFile : RestoreFromSeed}
          />
        ))}
      </RestoreBackupTab.Navigator>
    </Screen>
  );
};

function OnboardingHeader() {
  const navigation = useStackNavigation();
  const updateDrawer = useDrawerState((state) => state.updateDrawer);
  const { locale, updateLocale } = useLanguage();

  const openLanguageDrawer = () => {
    updateDrawer({
      title: i18n("language.select"),
      options: i18n.getLocales().map((l) => ({
        title: i18n(`languageName.${l}`),
        onPress: () => {
          updateLocale(l);
          updateDrawer({ show: false });
        },
        iconRightID: l === locale ? "check" : undefined,
      })),
      show: true,
    });
  };
  const headerIcons: HeaderIcon[] = [
    {
      id: "mail",
      color: tw.color("primary-background-light-color"),
      onPress: () => navigation.navigate("contact"),
    },
    {
      id: "globe",
      color: tw.color("primary-background-light-color"),
      onPress: openLanguageDrawer,
    },
  ];
  return (
    <Header
      title={i18n("restoreBackup.title")}
      icons={headerIcons}
      theme="transparent"
    />
  );
}
