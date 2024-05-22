import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useReducer } from "react";
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

  return (
    <QueryClientProvider client={queryClient}>
      <PeachWSContext.Provider value={peachWS}>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme}>
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
