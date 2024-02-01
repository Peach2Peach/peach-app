import analytics from "@react-native-firebase/analytics";
import { useCallback, useEffect } from "react";
import { AppState } from "react-native";
import { useCheckTradeNotifications } from "./hooks/useCheckTradeNotifications";
import { getPeachInfo } from "./init/getPeachInfo";

let appState = "active";

export const usePartialAppSetup = () => {
  useCheckTradeNotifications();

  const appStateCallback = useCallback((isActive: boolean) => {
    if (isActive) {
      getPeachInfo();
      analytics().logAppOpen();
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/u) && nextAppState === "active") {
        appStateCallback(true);
      } else if (
        appState === "active" &&
        nextAppState.match(/inactive|background/u)
      ) {
        appStateCallback(false);
      }

      appState = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [appStateCallback]);
};
