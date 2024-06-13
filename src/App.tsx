import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { TolgeeProvider } from "@tolgee/react";
import { useReducer } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { useDeviceContext } from "twrnc";
import { GlobalOverlay } from "./Overlay";
import { Drawer } from "./components/drawer/Drawer";
import { GlobalPopup } from "./components/popup/GlobalPopup";
import { Toast } from "./components/toast/Toast";
import { useWebSocket } from "./init/websocket";
import { queryClient } from "./queryClient";
import tw from "./styles/tailwind";
import { tolgee } from "./tolgee";
import {
  PeachWSContext,
  getWebSocket,
  setPeachWS,
} from "./utils/peachAPI/websocket";
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
    <TolgeeProvider tolgee={tolgee}>
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
    </TolgeeProvider>
  );
};
