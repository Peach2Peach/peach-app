import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { AppState, View } from "react-native";
import { useAppColorScheme } from "twrnc";
import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PeachText } from "../../components/text/PeachText";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { AnalyticsPopup } from "../../popups/AnalyticsPopup";
import { WarningPopup } from "../../popups/WarningPopup";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n, { useI18n } from "../../utils/i18n";
import { checkNotificationStatus } from "../../utils/system/checkNotificationStatus";
import { isProduction } from "../../utils/system/isProduction";
import { toggleNotifications } from "../../utils/system/toggleNotifications";
import { isDefined } from "../../utils/validation/isDefined";
import { SettingsItem } from "./components/SettingsItem";
import { VersionInfo } from "./components/VersionInfo";

const contactUs = isProduction()
  ? (["contact", "aboutPeach"] as const)
  : (["testView", "contact", "aboutPeach"] as const);

export const Settings = () => {
  useI18n();
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const [notificationsOn, setNotificationsOn] = useState(false);

  const navigation = useStackNavigation();

  const { isDarkMode, autoMode, toggleTheme, toggleAutoMode } = useThemeStore();

  const [enableAnalytics, toggleAnalytics, showBackupReminder, appPinCode] =
    useSettingsStore(
      (state) => [
        state.enableAnalytics,
        state.toggleAnalytics,
        state.showBackupReminder,
        state.appPinCode,
      ],
      shallow,
    );

  useFocusEffect(
    useCallback(() => {
      const checkingFunction = async () => {
        setNotificationsOn(await checkNotificationStatus());
      };
      const eventListener = AppState.addEventListener(
        "change",
        checkingFunction,
      );

      checkingFunction();

      return () => {
        eventListener.remove();
      };
    }, []),
  );

  const notificationClick = useCallback(() => {
    if (notificationsOn) {
      setPopup(
        <WarningPopup
          title={i18n("settings.notifications.popup.title")}
          content={i18n("settings.notifications.popup")}
          actions={
            <>
              <PopupAction
                label={i18n("settings.notifications.popup.neverMind")}
                textStyle={tw`text-black-100`}
                iconId="arrowLeftCircle"
                onPress={closePopup}
              />
              <PopupAction
                label={i18n("settings.notifications.popup.yes")}
                textStyle={tw`text-black-100`}
                iconId="slash"
                onPress={() => {
                  closePopup();
                  toggleNotifications();
                }}
                reverseOrder
              />
            </>
          }
        />,
      );
    } else {
      toggleNotifications();
    }
  }, [closePopup, notificationsOn, setPopup]);

  const profileSettings = useMemo(
    () =>
      [
        "myProfile",
        "referrals",
        {
          title: "backups",
          iconId: showBackupReminder ? "alertTriangle" : undefined,
          warning: !!showBackupReminder,
        },
        "networkFees",
        "transactionBatching",
        "paymentMethods",
      ] as const,
    [showBackupReminder],
  );

  const setAnalyticsPopupSeen = useSettingsStore(
    (state) => state.setAnalyticsPopupSeen,
  );
  const onAnalyticsPress = useCallback(() => {
    if (!enableAnalytics) {
      setAnalyticsPopupSeen(true);
      setPopup(<AnalyticsPopup />);
    } else {
      toggleAnalytics();
    }
  }, [enableAnalytics, setAnalyticsPopupSeen, setPopup, toggleAnalytics]);

  const [, toggleColorScheme] = useAppColorScheme(tw);
  const toggleDarkMode = useCallback(() => {
    toggleTheme();
    toggleColorScheme();
  }, [toggleColorScheme, toggleTheme]);

  const pinCodeSetupOnClick = () => {
    if (appPinCode === undefined || appPinCode === "") {
      navigation.navigate("createPin");
    } else {
      navigation.navigate("pinCodeSetup");
    }
  };

  const toggleAutoModeHandler = useCallback(() => {
    toggleAutoMode();
    if (!autoMode) {
      toggleColorScheme();
    }
  }, [autoMode, toggleAutoMode, toggleColorScheme]);

  const appSettings = useMemo(
    () =>
      (
        [
          {
            title: "analytics",
            onPress: onAnalyticsPress,
            iconId: enableAnalytics ? "toggleRight" : "toggleLeft",
            enabled: enableAnalytics,
          },
          { title: "pinCodeSetup", onPress: pinCodeSetupOnClick },
          {
            title: "notifications",
            onPress: notificationClick,
          },
          "nodeSetup",
          "refundAddress",
          "payoutAddress",
          "currency",
          "language",
          {
            title: "use system settings",
            onPress: toggleAutoModeHandler,
            iconId: autoMode ? "toggleRight" : "toggleLeft",
            enabled: autoMode,
          },
          {
            title: "dark mode",
            onPress: toggleDarkMode,
            iconId: isDarkMode ? "toggleRight" : "toggleLeft",
            enabled: isDarkMode,
            disabled: autoMode,
          },
        ] as const
      ).filter(isDefined),
    [
      onAnalyticsPress,
      enableAnalytics,
      notificationClick,
      toggleAutoModeHandler,
      autoMode,
      toggleDarkMode,
      isDarkMode,
    ],
  );

  const settings = [
    { items: contactUs },
    { headline: "profileSettings", items: profileSettings },
    { headline: "appSettings", items: appSettings },
  ];

  return (
    <Screen header={<Header title={i18n("settings.title")} hideGoBackButton />}>
      <PeachScrollView>
        {settings.map(({ headline, items }) => (
          <View key={`settings-${headline}`}>
            {headline && (
              <PeachText
                style={tw`mb-3 text-left lowercase h6 text-primary-main mt-9`}
              >
                {i18n(`settings.${headline}`)}
              </PeachText>
            )}
            <View style={tw`gap-6 py-3 px-6px`}>
              {items.map((item, i) => {
                const props = typeof item === "string" ? { title: item } : item;
                return (
                  <SettingsItem
                    key={`${headline}-${typeof item === "string" ? item : item.title}-${i}`}
                    {...props}
                  />
                );
              })}
            </View>
          </View>
        ))}
        <VersionInfo style={tw`mb-10 text-center mt-9`} />
      </PeachScrollView>
    </Screen>
  );
};
