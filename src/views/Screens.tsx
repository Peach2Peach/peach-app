import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import BootSplash from "react-native-bootsplash";
import { useSetPopup } from "../components/popup/GlobalPopup";
import { useSetToast } from "../components/toast/Toast";
import { useStackNavigation } from "../hooks/useStackNavigation";
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
  const navigation = useStackNavigation();
  const setPopup = useSetPopup();
  const initApp = useInitApp();
  useEffect(() => {
    const initialize = async () => {
      const statusResponse = await initApp();
      if (!statusResponse || statusResponse.error) {
        if (statusResponse?.error === "HUMAN_VERIFICATION_REQUIRED") {
          setPopup(<VerifyYouAreAHumanPopup />);
        } else {
          setToast({
            msgKey: statusResponse?.error || "NETWORK_ERROR",
            color: "red",
            action: {
              onPress: () => navigation.navigate("contact"),
              label: i18n("contactUs"),
              iconId: "mail",
            },
          });
        }
      }
      requestUserPermissions();
      setIsLoading(false);
      await BootSplash.hide({ fade: true });
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
