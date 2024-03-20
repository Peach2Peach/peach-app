import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useState } from "react";
import { View } from "react-native";
import z from "zod";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { fullScreenTabNavigationScreenOptions } from "../../constants";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { HelpPopup } from "../../popups/HelpPopup";
import { InfoPopup } from "../../popups/InfoPopup";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";
import { BackupPasswordPrompt } from "./components/backups/BackupPasswordPrompt";
import { FileBackupOverview } from "./components/backups/FileBackupOverview";
import { SeedPhrase } from "./components/backups/SeedPhrase";
import { useTranslate } from "@tolgee/react";

const BackupTab = createMaterialTopTabNavigator();
const tabs = ["fileBackup", "seedPhrase"] as const;
const TabType = z.enum(tabs);
type TabType = z.infer<typeof TabType>;

export const Backups = () => {
  const { t } = useTranslate("settings");
  const [currentTab, setCurrentTab] = useState<TabType>(tabs[0]);
  const [showPasswordPrompt, toggle] = useToggleBoolean();

  return (
    <Screen
      style={tw`px-0`}
      header={
        <BackupHeader
          tab={currentTab}
          showPasswordPrompt={showPasswordPrompt}
        />
      }
    >
      <BackupTab.Navigator
        screenOptions={fullScreenTabNavigationScreenOptions}
        sceneContainerStyle={[tw`px-sm`, tw`md:px-md`]}
        screenListeners={{
          focus: (e) => setCurrentTab(TabType.parse(e.target?.split("-")[0])),
        }}
      >
        <>
          {tabs.map((tab) => (
            <BackupTab.Screen
              key={tab}
              name={tab}
              options={{ title: `${t(`settings.backups.${tab}`)}` }}
            >
              {() => (
                <>
                  {tab === "fileBackup" ? (
                    showPasswordPrompt ? (
                      <BackupPasswordPrompt toggle={toggle} />
                    ) : (
                      <FileBackupOverview next={toggle} />
                    )
                  ) : (
                    <SeedPhrase />
                  )}
                </>
              )}
            </BackupTab.Screen>
          ))}
        </>
      </BackupTab.Navigator>
    </Screen>
  );
};

function BackupHeader({
  tab,
  showPasswordPrompt,
}: {
  tab: "fileBackup" | "seedPhrase";
  showPasswordPrompt?: boolean;
}) {
  const { t } = useTranslate("settings");
  const setPopup = useSetPopup();
  const showSeedPhrasePopup = () => setPopup(<SeedPhrasePopup />);
  const showFileBackupPopup = () => setPopup(<HelpPopup id="fileBackup" />);
  const showYourPasswordPopup = () => setPopup(<YourPasswordPopup />);

  return (
    <Header
      title={
        tab === "fileBackup"
          ? t("settings.backups.fileBackup.title")
          : t("settings.backups.walletBackup")
      }
      icons={[
        {
          ...headerIcons.help,
          onPress:
            tab === "fileBackup"
              ? showPasswordPrompt
                ? showYourPasswordPopup
                : showFileBackupPopup
              : showSeedPhrasePopup,
        },
      ]}
    />
  );
}

function SeedPhrasePopup() {
  const { t } = useTranslate("settings");
  return (
    <InfoPopup
      title={t("settings.backups.seedPhrase.popup.title")}
      content={
        <PeachText>
          {t("settings.backups.seedPhrase.popup.text.1")}
          {"\n\n"}
          <PeachText style={tw`font-bold`}>
            {t("settings.backups.seedPhrase.popup.text.2")}
          </PeachText>
        </PeachText>
      }
    />
  );
}

function YourPasswordPopup() {
  const { t } = useTranslate("settings");
  return (
    <InfoPopup
      title={t("settings.backups.fileBackup.popup2.title")}
      content={
        <>
          <PeachText>
            {t("settings.backups.fileBackup.popup2.content.1")}
          </PeachText>

          <PeachText style={tw`mt-3`}>
            {t("settings.backups.fileBackup.popup2.content.2")}
          </PeachText>

          <View style={tw`pl-1 my-3`}>
            <PeachText>
              {t("settings.backups.fileBackup.popup2.content.3")}
            </PeachText>
            <PeachText>
              {t("settings.backups.fileBackup.popup2.content.4")}
            </PeachText>
            <PeachText>
              {t("settings.backups.fileBackup.popup2.content.5")}
            </PeachText>
          </View>

          <PeachText style={tw`font-bold`}>
            {t("settings.backups.fileBackup.popup2.content.6")}
          </PeachText>
        </>
      }
    />
  );
}
