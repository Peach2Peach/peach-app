import analytics from "@react-native-firebase/analytics";
import {
  DefaultTheme,
  NavigationContainer,
  NavigationState,
} from "@react-navigation/native";
import { useEffect, useReducer } from "react";
import { enableScreens } from "react-native-screens";

import {
  getWebSocket,
  PeachWSContext,
  setPeachWS,
} from "./utils/peachAPI/websocket";

import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDeviceContext } from "twrnc";
import { Drawer } from "./components/drawer/Drawer";
import { GlobalPopup } from "./components/popup/GlobalPopup";
import { Toast } from "./components/toast/Toast";
import { useWebSocket } from "./init/websocket";
import { GlobalOverlay } from "./Overlay";
import { queryClient } from "./queryClient";
import tw from "./styles/tailwind";
import { usePartialAppSetup } from "./usePartialAppSetup";
import { info } from "./utils/log/info";
import { Screens } from "./views/Screens";

enableScreens();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export const App = () => {
  useDeviceContext(tw);
  const [peachWS, updatePeachWS] = useReducer(setPeachWS, getWebSocket());
  useWebSocket(updatePeachWS);
  usePartialAppSetup();

  useEffect(() => {
    analytics().logAppOpen();
  }, []);

  const onNavStateChange = (state?: NavigationState) => {
    const newPage = state?.routes[state.routes.length - 1].name;
    info("Navigation event", newPage);
    analytics().logScreenView({
      screen_name: newPage,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PeachWSContext.Provider value={peachWS}>
        <SafeAreaProvider>
          <NavigationContainer
            theme={navTheme}
            onStateChange={onNavStateChange}
          >
            <Screens />
            <Drawer />
            <GlobalPopup />
            <GlobalOverlay />
            <Toast />
          </NavigationContainer>
        </SafeAreaProvider>
      </PeachWSContext.Provider>
    </QueryClientProvider>
  );
};
