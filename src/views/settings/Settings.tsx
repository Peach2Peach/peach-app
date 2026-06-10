import { stat } from "@dr.pogodin/react-native-fs";
import { useFocusEffect } from "@react-navigation/native";
import { KeychainKind } from "bdk-rn";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Pressable, View } from "react-native";
import { useAppColorScheme } from "twrnc";
import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { NumberInput } from "../../components/inputs/NumberInput";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { PopupComponent } from "../../components/popup/PopupComponent";
import { PeachText } from "../../components/text/PeachText";
import { BUNDLEID, UNIQUEID } from "../../constants";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { AnalyticsPopup } from "../../popups/AnalyticsPopup";
import { WarningPopup } from "../../popups/WarningPopup";
import { useConfigStore } from "../../store/configStore/configStore";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n, { useI18n } from "../../utils/i18n";
import { checkNotificationStatus } from "../../utils/system/checkNotificationStatus";
import { isProduction } from "../../utils/system/isProduction";
import { toggleNotifications } from "../../utils/system/toggleNotifications";
import { isDefined } from "../../utils/validation/isDefined";
import { useNodeConfigState } from "../../utils/wallet/nodeConfigStore";
import { peachWallet } from "../../utils/wallet/setWallet";
import { SettingsItem } from "./components/SettingsItem";
import { VersionInfo } from "./components/VersionInfo";

const SECRET_TAP_COUNT = 7;
const SECRET_TAP_WINDOW_MS = 500;

export const Settings = () => {
  useI18n();
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [showDebugIds, setShowDebugIds] = useState(false);
  const [walletDbSizeMb, setWalletDbSizeMb] = useState<string | undefined>();

  useEffect(() => {
    if (!showDebugIds) return;
    const path = peachWallet?.sqlitePath;
    if (!path) {
      setWalletDbSizeMb("n/a");
      return;
    }
    stat(path)
      .then((s) => setWalletDbSizeMb((s.size / 1024 / 1024).toFixed(2)))
      .catch(() => setWalletDbSizeMb("missing"));
  }, [showDebugIds]);
  const versionTapCountRef = useRef(0);
  const lastVersionTapRef = useRef(0);

  const onVersionPress = useCallback(() => {
    const now = Date.now();
    versionTapCountRef.current =
      now - lastVersionTapRef.current > SECRET_TAP_WINDOW_MS
        ? 1
        : versionTapCountRef.current + 1;
    lastVersionTapRef.current = now;
    if (versionTapCountRef.current >= SECRET_TAP_COUNT) {
      setShowDebugIds(true);
      versionTapCountRef.current = 0;
    }
  }, []);

  const navigation = useStackNavigation();

  const { isDarkMode, toggleTheme } = useThemeStore();

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

  const webAppAvailable = useConfigStore((state) => state.webAppAvailable);
  const showPasteDesktopConnection = useConfigStore(
    (state) => state.showPasteDesktopConnection,
  );

  const contactUs = useMemo(() => {
    const showDesktopItems = webAppAvailable || showDebugIds;
    const items = [
      showDesktopItems && ("connectToDesktop" as const),
      showPasteDesktopConnection && ("pasteDesktopConnection" as const),
      showDesktopItems && ("mobilePendingActions" as const),
      !isProduction() && ("testView" as const),
      "contact" as const,
      "aboutPeach" as const,
    ];
    return items.filter(
      (item): item is Exclude<typeof item, false> => item !== false,
    );
  }, [webAppAvailable, showPasteDesktopConnection, showDebugIds]);

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

  const currentGapLimit = useNodeConfigState((state) => state.gapLimit ?? 25);
  const setCustomNode = useNodeConfigState((state) => state.setCustomNode);
  const onGapLimitPress = useCallback(() => {
    setPopup(
      <GapLimitPopup
        currentValue={currentGapLimit}
        onConfirm={(next) => {
          setCustomNode({ gapLimit: next });
          closePopup();
        }}
        onCancel={closePopup}
      />,
    );
  }, [closePopup, currentGapLimit, setCustomNode, setPopup]);

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
            title: "dark mode",
            onPress: toggleDarkMode,
            iconId: isDarkMode ? "toggleRight" : "toggleLeft",
            enabled: isDarkMode,
          },
          {
            title: `walletGapLimit`,
            onPress: onGapLimitPress,
          },
        ] as const
      ).filter(isDefined),
    [
      onAnalyticsPress,
      enableAnalytics,
      notificationClick,
      toggleDarkMode,
      isDarkMode,
      currentGapLimit,
      onGapLimitPress,
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
        <Pressable onPress={onVersionPress}>
          <VersionInfo style={tw`mb-10 text-center mt-9`} />
        </Pressable>
        {showDebugIds && (
          <>
            <PeachText>{"UNIQUE ID: " + UNIQUEID}</PeachText>
            <PeachText>{"BUNDLE ID: " + BUNDLEID}</PeachText>
            <PeachText>
              {"WALLET DB: " +
                (walletDbSizeMb ? `${walletDbSizeMb} MB` : "loading…")}
            </PeachText>
          </>
        )}
      </PeachScrollView>
    </Screen>
  );
};

function GapLimitPopup({
  currentValue,
  onConfirm,
  onCancel,
}: {
  currentValue: number;
  onConfirm: (next: number) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(String(currentValue));
  const recommended = getRecommendedGapLimit();
  return (
    <PopupComponent
      title={i18n("settings.walletGapLimit.title")}
      content={
        <View style={tw`gap-3`}>
          <PeachText style={tw`text-black-100`}>
            {i18n("settings.walletGapLimit.description")}
            {recommended !== undefined && (
              <>
                {"\n\n"}
                {i18n(
                  "settings.walletGapLimit.recommended",
                  String(recommended),
                )}
              </>
            )}
          </PeachText>
          <NumberInput value={value} onChangeText={setValue} />
        </View>
      }
      actions={
        <>
          <PopupAction
            label={i18n("cancel")}
            iconId="xCircle"
            onPress={onCancel}
          />
          <PopupAction
            label={i18n("confirm")}
            iconId="checkSquare"
            onPress={() => {
              const parsed = parseInt(value, 10);
              if (Number.isFinite(parsed) && parsed > 0) onConfirm(parsed);
              else onCancel();
            }}
            reverseOrder
          />
        </>
      }
    />
  );
}

function getRecommendedGapLimit(): number | undefined {
  const wallet = peachWallet?.wallet;
  if (!wallet) return undefined;
  try {
    const maxRevealed = wallet.derivationIndex(KeychainKind.External);
    if (maxRevealed === undefined) return undefined;

    const scriptToIndex = new Map<string, number>();
    for (let i = 0; i <= maxRevealed; i++) {
      const hex = Buffer.from(
        wallet
          .peekAddress(KeychainKind.External, i)
          .address.scriptPubkey()
          .toBytes() as ArrayBuffer,
      ).toString("hex");
      scriptToIndex.set(hex, i);
    }

    const usedIndices = new Set<number>();
    for (const canonical of wallet.transactions()) {
      for (const out of canonical.transaction.output()) {
        const hex = Buffer.from(
          out.scriptPubkey.toBytes() as ArrayBuffer,
        ).toString("hex");
        const idx = scriptToIndex.get(hex);
        if (idx !== undefined) usedIndices.add(idx);
      }
    }

    const sortedUsed = [...usedIndices].sort((a, b) => a - b);
    let maxGap = 0;
    let prev = -1;
    for (const used of sortedUsed) {
      maxGap = Math.max(maxGap, used - prev);
      prev = used;
    }
    maxGap = Math.max(maxGap, maxRevealed - prev);

    return Math.max(25, maxGap);
  } catch {
    return undefined;
  }
}
