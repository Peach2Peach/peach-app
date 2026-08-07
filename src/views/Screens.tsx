import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import BootSplash from "react-native-bootsplash";
import { useSetPopup } from "../components/popup/GlobalPopup";
import { useSetPriorityToast, useSetToast } from "../components/toast/Toast";
import { useStackNavigation } from "../hooks/useStackNavigation";
import { checkBlockedCountry } from "../init/checkBlockedCountry";
import { requestUserPermissions } from "../init/requestUserPermissions";
import { useInitApp } from "../init/useInitApp";
import { VerifyYouAreAHumanPopup } from "../popups/warning/VerifyYouAreAHumanPopup";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../store/theme";
import tw from "../styles/tailwind";
import { useGlobalHandlers } from "../useGlobalHandlers";
import i18n from "../utils/i18n";
import { screenTransition } from "../utils/layout/screenTransition";
import { isIOS } from "../utils/system/isIOS";
import { isExpectedMixnetBlackhole } from "../utils/wallet/nym/nymGate";
import { useWSQueryInvalidation } from "./useWSQueryInvalidation";
import { onboardingViews, views } from "./views";

const RootStack = createStackNavigator<RootStackParamList>();

export function Screens() {
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = useSettingsStore((state) => state.isLoggedIn);
  const { isDarkMode } = useThemeStore();
  useWSQueryInvalidation();

  const backgroundStyle = isDarkMode
    ? "bg-backgroundMain-dark"
    : "bg-backgroundMain-light";

  const [hasHydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useSettingsStore.persist.onFinishHydration(
      () => setHydrated(true),
    );

    setHydrated(useSettingsStore.persist.hasHydrated());

    return unsubFinishHydration;
  }, []);
  useGlobalHandlers();

  const setToast = useSetToast();
  const setPriorityToast = useSetPriorityToast();
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();
  const initApp = useInitApp();
  useEffect(() => {
    const boot = async () => {
      const [blockedCountry, statusResponse] = await Promise.all([
        checkBlockedCountry(),
        initApp(),
      ]);
      if (blockedCountry) {
        // a blocked country explains any init failure, so prefer this message
        // and use a priority toast so background errors can't override it
        setPriorityToast({
          msgKey: "COUNTRY_BLOCKED",
          bodyArgs: [blockedCountry],
          color: "red",
          keepAlive: true,
        });
      } else if (!statusResponse || statusResponse.error) {
        if (statusResponse?.error === "HUMAN_VERIFICATION_REQUIRED") {
          setPopup(<VerifyYouAreAHumanPopup />);
        } else if (
          // Expected while the mixnet is blackholing traffic during connect
          // (fail-closed) — its own connecting/failed toast owns the UX; a red
          // network-error toast here would just overwrite it.
          !isExpectedMixnetBlackhole(statusResponse?.error ?? "NETWORK_ERROR")
        ) {
          setToast({
            msgKey: statusResponse?.error || "NETWORK_ERROR",
            color: "red",
            action: {
              onPress: () =>
                navigation.navigate("contact", {
                  errorMessage: statusResponse?.error,
                }),
              label: i18n("contactUs"),
              iconId: "mail",
            },
          });
        }
      }
      requestUserPermissions();
    };

    // The bootsplash covers the whole app, so hiding it must not depend on boot
    // succeeding: ANY failure in `boot` (a rejected init, a throwing handler)
    // would otherwise leave the user staring at the splash forever — and
    // release builds don't even surface the unhandled rejection.
    const initialize = async () => {
      try {
        await boot();
      } finally {
        setIsLoading(false);
        await BootSplash.hide({ fade: true }).catch(() => undefined);
      }
    };
    if (isLoading || !hasHydrated) initialize();
  }, [
    hasHydrated,
    initApp,
    isLoading,
    navigation,
    setIsLoading,
    setPopup,
    setToast,
    setPriorityToast,
  ]);

  return (
    <RootStack.Navigator
      screenOptions={{
        gestureEnabled: isIOS(),
        headerShown: false,
        cardStyle: tw`flex-1 ${backgroundStyle}`,
      }}
    >
      <>
        {(isLoggedIn ? views : onboardingViews).map(
          ({ name, component, animation }) => (
            <RootStack.Screen
              {...{ name, component }}
              key={name}
              options={{
                animation: animation || "default",
                transitionSpec: {
                  open: screenTransition,
                  close: screenTransition,
                },
              }}
            />
          ),
        )}
      </>
    </RootStack.Navigator>
  );
}
